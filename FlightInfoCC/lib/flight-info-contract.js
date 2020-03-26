/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
require('date-utils');
/*
{"ID":"F001","From":"BJ","To":"NY","Date":"2020-03-25","Passengers":"P0001"}
*/
class FlightInfoContract extends Contract {

    async getAllResults(iterator, getKeys) {
        const allResults = [];
        let loop = true;
        while (loop) {
            const res = await iterator.next();
            if (!res.value && res.done) {
                await iterator.close();
                return allResults;
            } else if (!res.value) {
                throw new Error('no value and not done (internal error?)');
            }
            const theVal = (getKeys) ? res.value.key : res.value.value.toString('utf8');
            allResults.push(JSON.parse(theVal));
            if (res.done) {
                await iterator.close();
                loop = false;
                return allResults;
            }
        }
    }

    async createFlightInfo(ctx,flightNo,flightInfo){
        const buffer = Buffer.from(flightInfo);
        await ctx.stub.putState(flightNo, buffer);
    }

    async SearchRecentFlight(ctx,personID,day){
        let Flights = [];
        let results = [];
        let date = new Date();
        let iterator;
        let i;
        let queryday;
        let queryString;
        for (i=0;i<day;i++){
            queryString = {};
            queryString.selector = {};
            queryString.selector.Passengers = personID;
            queryday = date.toFormat('YYYY-MM-DD');
            queryString.selector.Date = queryday;
            iterator = await ctx.stub.getQueryResult(queryString);
            if(!iterator){
                continue;
            }
            results=results.concat(await this.getAllResults(iterator));
            date.setDate(date.getDate()-1);
        }
        for(i=0;i<results.length;i++){
            Flights[i] = results[i].ID;
        }
        return JSON.stringify(Flights);
    }

    async GetPassengers(ctx,flightID){
        let results =[];
        let Passengers = [];
        let queryString = {};
        let i;
        queryString.selector = {};
        queryString.selector.ID = flightID;
        const iterator = await ctx.stub.getQueryResult(queryString);
        if(!iterator){
            return JSON.stringify(results);
        }
        results = await this.getAllResults(iterator);
        for(i=0;i<results.length;i++){
            Passengers[i] = results[i].Passengers;
        }
        return JSON.stringify(Passengers);
    }
}

module.exports = FlightInfoContract;
