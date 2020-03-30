# Area Alert System

## Overview
This is a project for call for code  2020.
As we are suffered convid-19. The major goal for this project is to do something to help CDC tracing people who shared markets or gas station in same area.

## Idea
The patients were infected some days before they went to hospital. For sample, people shopping at market via their credit card, gasing car via their credit card, they may be inffected as sharing spaces with the patients in market or gas station.
This project is try to 
Reduce CDC works on people tracing by use blockchain as solution to connected the sharing spaces via credit card record at market or gas station.
Reduce CDC works on people investigation by making people submit web UI form and AI technology to tell if he/she is save, may inffected, or highly recommand to do a test.
Reduce CDC works via data virsulizatin technology to show the status among the area.

## What this project did:
This project completed:
1) A webUI for indviduel subimt the credit card info, retrun he/she status.
2) A sample AI for adjust.
3) A blockchain logic connected market and CDC.

## Workflow
1) User submit info.
2) Checking blockchain system if he/she shared market with confirmed patient.
3) With blockchain feedback and UI collection data send to AI for result.
4) AI logic:
5) Updated user status on to blockchain.
6) Geo to show all user info ammong area.

## Architecture

### MarketInfoCC
The Market Info CC is a blockchian based system, saving people credit card info, as credit card, date, market location.

### HospitalInfoCC
The hopspital Info CC is a blockchian based system, saving patient info. By date, home location, 症状， status, confrimed or not.

### webUI 

### things left:
JAVA with blockchian
Useing proto file for same data formate among CDC chain, JAVA, AI
AI with JAVA
Blockchain refactor

### to do
1) using real data from CDC
2) deploy to some where to get credit card info.
3) deploy to CDC