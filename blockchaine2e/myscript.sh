#!/bin/bash

. scripts/utils.sh
LANGUAGE="node"
CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/FlightInfoCC"
#packageChaincode 1 0 1
installChaincode 0 1
installChaincode 0 2
CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/HospitalCC"
#packageChaincode 1 0 1
installChaincode 0 1 2.0
installChaincode 0 2 2.0