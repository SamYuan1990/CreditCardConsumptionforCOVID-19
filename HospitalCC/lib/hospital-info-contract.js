/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
require('date-utils');
/*
{"Localtion":"BJ","Date":"2020-03-25","Data_Before":3,"Patient":"P0001","Virus":"X"}
*/
class HospitalInfoContract extends Contract {

    async init(ctx){
        await ctx.stub.putState('location',Buffer.from(JSON.stringify([])));
    }

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

    async UpdateLocation(ctx,location){
        await ctx.stub.putState('location', Buffer.from(location));
    }

    async createConfirmed(ctx,credit_card,cough,chest_pain,fever,date,status){
        let PersonInfo ={};
        PersonInfo.credit_card=credit_card;
        PersonInfo.cough=cough;
        PersonInfo.chest_pain=chest_pain;
        PersonInfo.fever=fever;
        PersonInfo.status=status;
        PersonInfo.Date=date;
        PersonInfo.confirmed='true';
        const buffer = Buffer.from(JSON.stringify(PersonInfo));
        console.log('create '+ JSON.stringify(PersonInfo));
        await ctx.stub.putState(credit_card, buffer);
    }

    async getLocations(ctx){
        let marbleAsbytes = await ctx.stub.getState('location'); //get the marble from chaincode state
        console.log('location:'+marbleAsbytes);
        console.log('location:'+marbleAsbytes.toString());
        return marbleAsbytes.toString();
    }


    async createPatientInfo(ctx,credit_card,cough,chest_pain,fever,date,status){
        let PersonInfo ={};
        PersonInfo.credit_card=credit_card;
        PersonInfo.cough=cough;
        PersonInfo.chest_pain=chest_pain;
        PersonInfo.fever=fever;
        PersonInfo.status=status;
        PersonInfo.Date=date;
        PersonInfo.confirmed='false';
        const buffer = Buffer.from(JSON.stringify(PersonInfo));
        console.log('create '+ JSON.stringify(PersonInfo));
        await ctx.stub.putState(credit_card, buffer);
    }

    async queryByStatusDate(ctx,status,day){
        let People = [];
        let results = [];
        let date = new Date();
        let iterator;
        let i;
        let queryday;
        let queryString;
        for (i=0;i<day;i++){
            queryString = {};
            queryString.selector = {};
            queryString.selector.status = status;
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
            People[i] = results[i].credit_card;
        }
        return JSON.stringify(People);
    }


    async queryByStatus(ctx,status){
        let People = [];
        let results =[];
        let queryString = {};
        let i;
        queryString.selector = {};
        queryString.selector.status = status;
        console.log('query '+ JSON.stringify(queryString));
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        if(!iterator){
            return JSON.stringify(results);
        }
        console.log('find data'+iterator);
        results = await this.getAllResults(iterator);
        for(i=0;i<results.length;i++){
            People[i] = results[i].credit_card;
        }
        return JSON.stringify(People);
    }
}

module.exports = HospitalInfoContract;
