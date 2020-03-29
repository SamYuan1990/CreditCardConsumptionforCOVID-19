const express=require('express');

var server=express();

server.listen(5000);
server.get('/data',function(req,res){
    let data = {
        "Afghanistan" : Math.round(Math.random()*1000),
        "Australia" : Math.round(Math.random()*1000),
        "Japan" : Math.round(Math.random()*1000),
        "Canada": Math.round(Math.random()*1000),
        "China" : Math.round(Math.random()*1000)
      }
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).send(data);
})

server.get('/dataArray',function(req,res){
    const dataArray = [0,1000];
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).send(dataArray);
})