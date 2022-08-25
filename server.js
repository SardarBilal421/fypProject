const express = require('express');
const dotenv = require('dotenv');
const app = require('./app');
const { path } = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const Db = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(Db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DataBase Connected Successfully');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log('App is runing /.....');
});
