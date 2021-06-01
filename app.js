const express = require('express')
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI);


app.get('/',(req,res)=>{
  res.send("Welcome to travel diaries server");
})

app.listen(PORT,()=>{
  console.log('Server is Running');
})