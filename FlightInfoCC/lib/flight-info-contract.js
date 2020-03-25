/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FlightInfoContract extends Contract {

    async flightInfoExists(ctx, flightInfoId) {
        const buffer = await ctx.stub.getState(flightInfoId);
        return (!!buffer && buffer.length > 0);
    }

    async createFlightInfo(ctx, flightInfoId, value) {
        const exists = await this.flightInfoExists(ctx, flightInfoId);
        if (exists) {
            throw new Error(`The flight info ${flightInfoId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(flightInfoId, buffer);
    }

    async readFlightInfo(ctx, flightInfoId) {
        const exists = await this.flightInfoExists(ctx, flightInfoId);
        if (!exists) {
            throw new Error(`The flight info ${flightInfoId} does not exist`);
        }
        const buffer = await ctx.stub.getState(flightInfoId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateFlightInfo(ctx, flightInfoId, newValue) {
        const exists = await this.flightInfoExists(ctx, flightInfoId);
        if (!exists) {
            throw new Error(`The flight info ${flightInfoId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(flightInfoId, buffer);
    }

    async deleteFlightInfo(ctx, flightInfoId) {
        const exists = await this.flightInfoExists(ctx, flightInfoId);
        if (!exists) {
            throw new Error(`The flight info ${flightInfoId} does not exist`);
        }
        await ctx.stub.deleteState(flightInfoId);
    }

}

module.exports = FlightInfoContract;
