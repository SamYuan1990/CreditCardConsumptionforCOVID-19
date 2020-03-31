/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
require('date-utils');
/*
{"ID":"M001","Date":"2020-03-25","Credit_Card":"C0001"}
*/
class MarketInfoContract extends Contract {

    async getAllResults(iterator, getKeys) {
        const allResults = [];
        let loop = true;
        while (loop) {
            const res = await iterator.next();
            console.log('current iterator '+JSON.stringify(res));
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

    async createTradeInfo(ctx,MarketID,Credit_Card,Date){
        let data = {};
        data.ID=MarketID;
        data.Credit_Card=Credit_Card;
        data.Date=Date;
        await ctx.stub.putState(MarketID+'_'+Credit_Card,Buffer.from(JSON.stringify(data)));
    }

    async SearchRecentMarket(ctx,personID){
        let Markets = [];
        let results = [];
        let date = new Date();
        let iterator;
        let i;
        let queryday;
        let queryString;
        for (i=0;i<14;i++){
            queryString = {};
            queryString.selector = {};
            queryString.selector.Credit_Card = personID;
            queryday = date.toFormat('YYYY-MM-DD');
            queryString.selector.Date = queryday;
            console.log('query '+ JSON.stringify(queryString));
            iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
            if(!iterator){
                continue;
            }
            console.log('find data'+iterator);
            results=results.concat(await this.getAllResults(iterator));
            date.setDate(date.getDate()-1);
        }
        for(i=0;i<results.length;i++){
            Markets[i] = results[i].ID;
        }
        return JSON.stringify(Markets);
    }
}

module.exports = MarketInfoContract;
