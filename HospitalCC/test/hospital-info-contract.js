/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HospitalInfoContract } = require('..');
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

describe('HospitalInfoContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HospitalInfoContract();
        ctx = new TestContext();
    });

    describe('#Create New patient Info', ()=>{

        it('should create a patient info', async () => {
            await contract.createPatientInfo(ctx,'P0001_X','{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('P0001_X',Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}'));
        });


        it('should create a patient info for another', async () => {
            await contract.createPatientInfo(ctx,'P0002_X','{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0002","Virus":"X"}');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('P0002_X',Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0002","Virus":"X"}'));
        });
    });

    describe('#Search Recent patient taken by Virus and Date', ()=>{
        it('should return', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}'),
                ]));
            await contract.SearchRecentPatients(ctx,'X',5).should.eventually.deep.equal(JSON.stringify(['P0001']));
        });

        it('should return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}'),
                ]));
            let queryString2 = {};
            queryString2.selector = {};
            queryString2.selector.Virus = 'X';
            queryString2.selector.Date = new Date(new Date().setDate(new Date().getDate() - 1)).toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString2).resolves(
                createIterator([
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-24","Data_Before":3,"Patient":"P0002","Virus":"X"}'),
                ]));
            await contract.SearchRecentPatients(ctx,'X',5).should.eventually.deep.equal(JSON.stringify(['P0001','P0002']));
        });

        it('Not found',async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(queryString).resolves(createIterator([]));
            await contract.SearchRecentPatients(ctx,'X',5).should.eventually.deep.equal(JSON.stringify([]));
        });
    });

    describe('#Search Patients list via Virus', ()=>{
        it('found return one', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}'),
                ]));
            await contract.GetPatients(ctx,'X').should.eventually.deep.equal(JSON.stringify([({Localtion:'Space',Date:'2020-03-25',Data_Before:3,Patient:'P0001',Virus:'X'})]));
        });

        it('found return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}'),
                    Buffer.from('{"Localtion":"Space","Date":"2020-03-25","Data_Before":3,"Patient":"P0002","Virus":"X"}')
                ]));
            await contract.GetPatients(ctx,'X').should.eventually.deep.equal(JSON.stringify([{Localtion:'Space',Date:'2020-03-25',Data_Before:3,Patient:'P0001',Virus:'X'},{Localtion:'Space',Date:'2020-03-25',Data_Before:3,Patient:'P0002',Virus:'X'}]));
        });

        it('Not found', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = 'X';
            ctx.stub.getQueryResult.withArgs(queryString).resolves(
                createIterator([]));
            await contract.GetPatients(ctx,'X').should.eventually.deep.equal(JSON.stringify([]));
        });
    });

});