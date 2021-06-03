const express = require('express')
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/keys')



mongoose.connect(MONGOURI,{
  keepAlive: true,
  useNewUrlParser: true,
  useNewUrlParser:true,
  useUnifiedTopology: true

})
mongoose.connection.on('connected',()=>{
  console.log("Conneted to mongoDB")
})

require('./models/user')
require('./models/post')

app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/users'))
app.use(require('./routes/posts'))



app.get('/',(req,res)=>{
  res.send("Welcome to travel diaries server");
})

app.listen(PORT,()=>{
  console.log('Server is Running');
})