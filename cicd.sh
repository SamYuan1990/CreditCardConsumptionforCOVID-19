cd blockchaine2e
git submodule init
cd fabric-samples
git checkout v1.4.4
curl -sS https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh -o ./scripts/bootstrap.sh
chmod +x ./scripts/bootstrap.sh
./scripts/bootstrap.sh 1.4.4 1.4.4 1.4.4
cd ..
cp -r crypto-config ./fabric-samples/first-network
cp ./byfn.sh ./fabric-samples/first-network
cd fabric-samples/first-network
./byfn.sh up -n -i 1.4.4 -s couchdb -a
cd ../..
docker cp myscriptMarket.sh cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
docker cp myscripHospital.sh cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
cd ..
docker cp MarketCC cli:/opt/gopath/src/github.com/chaincode/
docker cp HospitalCC cli:/opt/gopath/src/github.com/chaincode/
docker exec cli scripts/myscriptMarket.sh    
docker exec cli scripts/myscripHospital.sh    
cd JavaServer
nohup gradle runbootRun &
sleep 60
curl http://localhost:5000
cat nohup.out
cd ..
cd webUI/my-app
npm install
nohup npm start &
curl http://localhost:3000
cat nohup.out