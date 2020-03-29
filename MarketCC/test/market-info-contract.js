/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MarketInfoContract } = require('..');
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

describe('MarketInfoContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MarketInfoContract();
        ctx = new TestContext();
    });

    describe('#Create New flight Info', ()=>{

        it('should create a flight info', async () => {
            await contract.createTradeInfo(ctx,'M001_C0001','{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('M001_C0001',Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}'));
        });


        it('should create a flight info for another', async () => {
            await contract.createTradeInfo(ctx,'M001_C0002','{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0002"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('M001_C0002',Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0002"}'));
        });
    });

    describe('#Search Recent Market taken by Credit Card and Date range', ()=>{
        it('should return', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = 'C0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}')
                ]));
            await contract.SearchRecentMarket(ctx,'C0001',5).should.eventually.deep.equal(JSON.stringify(['M001']));
        });

        it('should return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = 'C0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}')
                ]));
            let queryString2 = {};
            queryString2.selector = {};
            queryString2.selector.Credit_Card = 'C0001';
            queryString2.selector.Date = new Date(new Date().setDate(new Date().getDate() - 1)).toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString2)).resolves(
                createIterator([
                    Buffer.from('{"ID":"M002","Date":"2020-03-25","Credit_Card":"C0001"}')
                ]));
            await contract.SearchRecentMarket(ctx,'P0001',5).should.eventually.deep.equal(JSON.stringify(['M001','M002']));
        });

        it('Not found',async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = 'C0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(createIterator([]));
            await contract.SearchRecentMarket(ctx,'C0001',5).should.eventually.deep.equal(JSON.stringify([]));
        });
    });

    describe('#Search Passenger list via Flight', ()=>{
        it('found return one', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'M001';
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}')
                ]));
            await contract.GetCreditCards(ctx,'M001').should.eventually.deep.equal(JSON.stringify(['C0001']));
        });

        it('found return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'M001';
            const data = createIterator([Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}'),
            Buffer.from('{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0002"}')]);
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(data);
            await contract.GetCreditCards(ctx,'F001').should.eventually.deep.equal(JSON.stringify(['C0001','C0002']));
        });

        it('Not found', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.ID = 'M001';
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(createIterator([]));
            await contract.GetCreditCards(ctx,'M001').should.eventually.deep.equal(JSON.stringify([]));
        });
    });

});