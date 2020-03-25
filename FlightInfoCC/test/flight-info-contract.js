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

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

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
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"flight info 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"flight info 1002 value"}'));
    });

    describe('#flightInfoExists', () => {

        it('should return true for a flight info', async () => {
            await contract.flightInfoExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a flight info that does not exist', async () => {
            await contract.flightInfoExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createFlightInfo', () => {

        it('should create a flight info', async () => {
            await contract.createFlightInfo(ctx, '1003', 'flight info 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"flight info 1003 value"}'));
        });

        it('should throw an error for a flight info that already exists', async () => {
            await contract.createFlightInfo(ctx, '1001', 'myvalue').should.be.rejectedWith(/The flight info 1001 already exists/);
        });

    });

    describe('#readFlightInfo', () => {

        it('should return a flight info', async () => {
            await contract.readFlightInfo(ctx, '1001').should.eventually.deep.equal({ value: 'flight info 1001 value' });
        });

        it('should throw an error for a flight info that does not exist', async () => {
            await contract.readFlightInfo(ctx, '1003').should.be.rejectedWith(/The flight info 1003 does not exist/);
        });

    });

    describe('#updateFlightInfo', () => {

        it('should update a flight info', async () => {
            await contract.updateFlightInfo(ctx, '1001', 'flight info 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"flight info 1001 new value"}'));
        });

        it('should throw an error for a flight info that does not exist', async () => {
            await contract.updateFlightInfo(ctx, '1003', 'flight info 1003 new value').should.be.rejectedWith(/The flight info 1003 does not exist/);
        });

    });

    describe('#deleteFlightInfo', () => {

        it('should delete a flight info', async () => {
            await contract.deleteFlightInfo(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a flight info that does not exist', async () => {
            await contract.deleteFlightInfo(ctx, '1003').should.be.rejectedWith(/The flight info 1003 does not exist/);
        });

    });

});