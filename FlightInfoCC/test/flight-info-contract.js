/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { FlightInfoContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
require('date-utils');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

function createIterator(items) {
    let i =0;
    return {
        next() {
            let done = (i >= items.length);
            let value = {};
            if(!done){
                value.value=items[i++];
            } else{
                value = undefined;
            }
            return {
                done,
                value
            };
        },
        close(){

        }
    };
}

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('FlightInfoContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new FlightInfoContract();
        ctx = new TestContext();
    });

    describe('#Create New flight Info', ()=>{

        it('should create a flight info', async () => {
            await contract.createFlightInfo(ctx,'F001_P0001','{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('F001_P0001',Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}'));
        });


        it('should create a flight info for another', async () => {
            await contract.createFlightInfo(ctx,'F001_P0002','{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0002"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('F001_P0002',Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0002"}'));
        });
    });

    describe('#Search Recent Flight taken by PersonID and Date', ()=>{
        it('should return', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Passengers = 'P0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}')
                ]));
            await contract.SearchRecentFlight(ctx,'P0001',5).should.eventually.deep.equal(JSON.stringify(['F001']));
        });

        it('should return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Passengers = 'P0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}')
                ]));
            let queryString2 = {};
            queryString2.selector = {};
            queryString2.selector.Passengers = 'P0001';
            queryString2.selector.Date = new Date(new Date().setDate(new Date().getDate() - 1)).toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString2).resolves(
                createIterator([
                    Buffer.from('{"ID":"F002","From":"BJ","To":"NY","Date":"2020-03-24","Passengers":"P0001"}')
                ]));
            await contract.SearchRecentFlight(ctx,'P0001',5).should.eventually.deep.equal(JSON.stringify(['F001','F002']));
        });

        it('Not found',async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Passengers = 'P0001';
            queryString.selector.Date = new Date().toFormat('yyyy-MM-dd');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(createIterator([]));
            await contract.SearchRecentFlight(ctx,'P0003',5).should.eventually.deep.equal(JSON.stringify([]));
        });
    });

    describe('#Search Passenger list via Flight', ()=>{
        it('found return one', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'F001';
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}')
                ]));
            await contract.GetPassengers(ctx,'F001').should.eventually.deep.equal(JSON.stringify(['P0001']));
        });

        it('found return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'F001';
            const data = createIterator([Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}'),Buffer.from('{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0002"}')]);
            ctx.stub.getQueryResult.withArgs(queryString).resolves(data);
            await contract.GetPassengers(ctx,'F001').should.eventually.deep.equal(JSON.stringify(['P0001','P0002']));
        });

        it('Not found', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'F001';
            ctx.stub.getQueryResult.withArgs(queryString).resolves(createIterator([]));
            await contract.GetPassengers(ctx,'F001').should.eventually.deep.equal(JSON.stringify([]));
        });
    });

});