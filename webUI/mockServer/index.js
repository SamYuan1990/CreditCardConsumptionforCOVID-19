const express=require('express');

var server=express();

server.listen(5000);
server.get('/data',function(req,res){
    let data = 
    {
        data : {
          "Afghanistan" : Math.round(Math.random()*1000),
          "Australia" : Math.round(Math.random()*1000),
          "Japan" : Math.round(Math.random()*1000),
          "Canada": Math.round(Math.random()*1000),
          "China" : Math.round(Math.random()*1000)
        },
        dataArray : [0,1000],
        range: [{label: "Red",
        usage: Math.round(Math.random()*30)},{label: "Yellow",
        usage: Math.round(Math.random()*30)},{label: "Green",
        usage: Math.round(Math.random()*30)}],
        BarRed: [
            {letter:"Mar-3",frequency:Math.round(Math.random()*30)}
            ,{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*10)}],
        BarYellow: [{letter:"Mar-3",frequency:Math.round(Math.random()*30)},{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*10)}],
        BarGreen: [{letter:"Mar-3",frequency:Math.round(Math.random()*30)},{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*30)}]
      };
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).send(data);
});

server.get('/mystaus',function(req,res){
  let data ={
    status:"success"
  }
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.status(200).send(data);
})