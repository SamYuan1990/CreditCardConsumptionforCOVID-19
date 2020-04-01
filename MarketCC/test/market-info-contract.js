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
            await contract.createTradeInfo(ctx,'M001','NYC','C0001','2020-03-30','13:00');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('M001_NYC_C0001',Buffer.from('{"Branch":"M001","City":"NYC","Credit_Card":"C0001","Date":"2020-03-30","Time":"13:00"}'));
        });


        it('should create a flight info for another', async () => {
            await contract.createTradeInfo(ctx,'M001','NYC','C0002','2020-03-30','17:00');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('M001_NYC_C0002',Buffer.from('{"Branch":"M001","City":"NYC","Credit_Card":"C0002","Date":"2020-03-30","Time":"17:00"}'));
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
                    Buffer.from('{"Branch":"M001","City":"NYC","Credit_Card":"C0001","Date":"2020-03-30","Time":"13:00"}')
                ]));
            await contract.SearchRecentMarket(ctx,'C0001').should.eventually.deep.equal(JSON.stringify([{Branch:'M001',City:'NYC'}]));
        });

        it('should return many', async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = 'C0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(
                createIterator([
                    Buffer.from('{"Branch":"M001","City":"NYC","Credit_Card":"C0001","Date":"2020-03-30","Time":"13:00"}'),
                    Buffer.from('{"Branch":"M002","City":"WA","Credit_Card":"C0001","Date":"2020-03-30","Time":"13:00"}')
                ]));
            let queryString2 = {};
            queryString2.selector = {};
            queryString2.selector.Credit_Card = 'C0001';
            queryString2.selector.Date = new Date(new Date().setDate(new Date().getDate() - 1)).toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString2)).resolves(
                createIterator([
                    Buffer.from('{"Branch":"M003","City":"CA","Credit_Card":"C0001","Date":"2020-03-30","Time":"13:00"}')
                ]));
            await contract.SearchRecentMarket(ctx,'C0001').should.eventually.deep.equal(JSON.stringify([{Branch:'M001',City:'NYC'},{Branch:'M002',City:'WA'},{Branch:'M003',City:'CA'}]));
        });

        it('Not found',async () => {
            let queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = 'C0001';
            queryString.selector.Date = new Date().toFormat('YYYY-MM-DD');
            ctx.stub.getQueryResult.withArgs(JSON.stringify(queryString)).resolves(createIterator([]));
            await contract.SearchRecentMarket(ctx,'C0001').should.eventually.deep.equal(JSON.stringify([]));
        });
    });
});