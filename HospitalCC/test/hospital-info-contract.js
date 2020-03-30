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

    describe('#getLocations Location', ()=>{

        it('should get a location info', async () => {
            ctx.stub.getState.withArgs('location').resolves(Buffer.from(JSON.stringify('["L0002"]')));
            await contract.getLocations(ctx,'L0001').should.eventually.deep.equal(Buffer.from(JSON.stringify('["L0002"]')));
        });
    });

    describe('#Update Location', ()=>{

        it('should create a location info', async () => {
            await contract.UpdateLocation(ctx,'["L0002"]');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('location','["L0002"]');
        });

        it('should create another location info', async () => {
            await contract.UpdateLocation(ctx,'["L0001"]');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('location','["L0001"]');
        });
    });

    describe('#New Confirm New patient Info', ()=>{

        it('should create a patient info', async () => {
            let PersonInfo ={};
            PersonInfo.credit_card='C0001';
            PersonInfo.cough='false';
            PersonInfo.chest_pain='false';
            PersonInfo.fever='3';
            PersonInfo.status='warning';
            PersonInfo.Date='2020-03-20';
            PersonInfo.confirmed='true';
            await contract.createConfirmed(ctx,'C0001','false','false','3','2020-03-20','warning');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('C0001',Buffer.from(JSON.stringify(PersonInfo)));
        });


        it('should create a patient info for another', async () => {
            let PersonInfo ={};
            PersonInfo.credit_card='C0002';
            PersonInfo.cough='false';
            PersonInfo.chest_pain='false';
            PersonInfo.fever='3';
            PersonInfo.status='warning';
            PersonInfo.Date='2020-03-20';
            PersonInfo.confirmed='true';
            await contract.createConfirmed(ctx,'C0002','false','false','3','2020-03-20','warning');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('C0002',Buffer.from(JSON.stringify(PersonInfo)));
        });
    });
    describe('#Create New patient Info', ()=>{

        it('should create a patient info', async () => {
            let PersonInfo ={};
            PersonInfo.credit_card='C0001';
            PersonInfo.cough='false';
            PersonInfo.chest_pain='false';
            PersonInfo.fever='3';
            PersonInfo.status='warning';
            PersonInfo.Date='2020-03-20';
            PersonInfo.confirmed='false';
            await contract.createPatientInfo(ctx,'C0001','false','false','3','2020-03-20','warning');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('C0001',Buffer.from(JSON.stringify(PersonInfo)));
        });


        it('should create a patient info for another', async () => {
            let PersonInfo ={};
            PersonInfo.credit_card='C0002';
            PersonInfo.cough='false';
            PersonInfo.chest_pain='false';
            PersonInfo.fever='3';
            PersonInfo.status='warning';
            PersonInfo.Date='2020-03-20';
            PersonInfo.confirmed='false';
            await contract.createPatientInfo(ctx,'C0002','false','false','3','2020-03-20','warning');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('C0002',Buffer.from(JSON.stringify(PersonInfo)));
        });
    });

    describe('#Search Recent people by status and Date', ()=>{
        it('should return', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0001","status":"success"}'),
                ]));
            await contract.queryByStatusDate(ctx,'success',5).should.eventually.deep.equal(JSON.stringify(['C0001']));
        });

        it('should return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0001","status":"success"}'),
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0003","status":"success"}'),
                ]));
            let queryString2 = {};
            queryString2.selector = {};
            queryString2.selector.status = 'success';
            queryString2.selector.Date = new Date(new Date().setDate(new Date().getDate() - 1)).toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString2)).resolves(
                createIterator([
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0002","status":"success"}'),
                ]));
            await contract.queryByStatusDate(ctx,'success',5).should.eventually.deep.equal(JSON.stringify(['C0001','C0003','C0002']));
        });

        it('Not found',async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(createIterator([]));
            await contract.queryByStatusDate(ctx,'success',5).should.eventually.deep.equal(JSON.stringify([]));
        });
    });

    describe('#Search people by status', ()=>{
        it('found return one', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0001","status":"success"}')
                ]));
            await contract.queryByStatus(ctx,'success').should.eventually.deep.equal(JSON.stringify(['C0001']));
        });

        it('found return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0001","status":"success"}'),
                    Buffer.from('{"cough":"false","Date":"2020-03-25","chest_pain":"false","fever":0,"credit_card":"C0002","status":"success"}'),
                ]));
            await contract.queryByStatus(ctx,'success').should.eventually.deep.equal(JSON.stringify(['C0001','C0002']));
        });

        it('Not found', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.status = 'success';
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([]));
            await contract.queryByStatus(ctx,'success').should.eventually.deep.equal(JSON.stringify([]));
        });
    });

});