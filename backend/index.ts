import express, { Request, Response } from "express";
var bodyParser = require('body-parser')
var Questions = require('./src/models/Question')
var cors = require('cors')
import {seedQuestions} from './src/seeder'

const app = express();
const mongoose = require('mongoose');
const gameRecordRoute = require('./src/routes/gameRecord');
require('dotenv').config({ path: './.env' })

app.use(cors())
app.options('*', cors()) 

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI not set");
}


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected DB:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    await seedDB();
  })
  .catch((err: any) => console.error(err));

const seedDB = async () => {
  const count = await Questions.countDocuments();
  if (count === 0) {
    await Questions.insertMany(seedQuestions);
    console.log('\nQuestions seeded into triviagame_app\n');
  } else {
    console.log('\nQuestions already exist, skipping seed\n');
  }
}

app.use(bodyParser.json())

app.use('/question', gameRecordRoute);


app.listen(process.env.PORT, () => {
    console.log(`\nserver started at http://localhost:`+process.env.PORT+'\n');
});
