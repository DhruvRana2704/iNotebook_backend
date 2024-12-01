const connectToMongo=require('./db')
const express = require('express')
var cors = require('cors')
connectToMongo()
const app = express()
const port = 5000
app.use(express.json())
app.use(cors(
  {
    origin:['i-notebook-sand.vercel.app'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
  }
))
// Available Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})