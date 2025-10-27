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

const client = mongoose
  .connect("mongodb://database:27017/triviagame_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('\nConnected to the Database.\n');
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
    console.log(`\nserver started at http://backend:`+process.env.PORT+'\n');
});
