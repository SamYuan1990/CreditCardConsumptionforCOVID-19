# Virus Alert System

## Overview
This is a project for call for code  2020.
As we are suffered convid-19. The major goal for this project is to do something as alert system at the 1st N days.

## Idea
### Background
When a virus stars from somewhere, hospital will receive patients. 

From medical point of view, the patients were infected some days before they went to hospital, and we call the duration as incubation period. For any new virus, we don't know the period at the beginning. So the 1st part of this system is to use AI to find out incubation period, R0 etc...

From geo point of view, people traving around the world. Flight as sample, with the patients identification and incubation period. We can get a list of people sharing same flight, train, ship etc...

Together with medical and geo views, we can say that hosptials from different localtions will report the patients with the virus.

### The idea
It's common agreement that the earlier for some actions be taken the better for social people(across the country, regoin etc...) to aginst the virus. The idea plans to use blockchain technological to connect hospitals and flight companys/ports across the regoins. Once a new virus been found, it will uploaded to blockchain and trigger AI for analysis. The AI will backfill to the system with index as incubation period, and try to find people sharing same flight, alrting as they may be infected. So that local goverment, or hosptial may know and taking actions as earlier as possible.

## Architecture


### FlightInfoCC
The filght Info CC is a blockchian based system, saving people travaling info. By date, from, to, identifier. Which will be used to tracking people who may be infected deal to sharing same filght.

### HospitalInfoCC
The hopspital Info CC is a blockchian based system, saving patient info. By date, location, virus, identifier. Which will be used to AI anaylsis and provide people identifier list.