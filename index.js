const connectToMongo=require('./db')
const express = require('express')
var cors = require('cors')
connectToMongo()
const app = express()
const port = process.env.PORT||5000
const corsOptions = {
  origin: '*', // Allow all origins (use caution in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};


app.use(express.json())
app.use(cors(corsOptions));
// Available Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})