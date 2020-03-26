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

    async createPatientInfo(ctx,CaseID,PatientInfo){
        const buffer = Buffer.from(PatientInfo);
        console.log('create:'+PatientInfo);
        await ctx.stub.putState(CaseID, buffer);
    }

    async SearchRecentPatients(ctx,Virus,day){
        let Patients = [];
        let results = [];
        let date = new Date();
        let iterator;
        let i;
        let queryday;
        let queryString;
        for (i=0;i<day;i++){
            queryString = {};
            queryString.selector = {};
            queryString.selector.Virus = Virus;
            queryday = date.toFormat('YYYY-MM-DD');
            queryString.selector.Date = queryday;
            console.log('query:'+queryString);
            iterator = await ctx.stub.getQueryResult(queryString);
            if(!iterator){
                continue;
            }
            results=results.concat(await this.getAllResults(iterator));
            date.setDate(date.getDate()-1);
        }
        for(i=0;i<results.length;i++){
            Patients[i] = results[i].Patient;
        }
        return JSON.stringify(Patients);
    }

    async GetPatients(ctx,Virus){
        let results =[];
        let queryString = {};
        queryString.selector = {};
        queryString.selector.Virus = Virus;
        console.log('query:'+queryString);
        const iterator = await ctx.stub.getQueryResult(queryString);
        if(!iterator){
            return JSON.stringify(results);
        }
        results = await this.getAllResults(iterator);
        return JSON.stringify(results);
    }
}

module.exports = HospitalInfoContract;
