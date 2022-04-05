import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {router as loginRegister} from './src/routes/loginRegister';
import{router as profileBlogs} from './src/routes/profileBlogs';

const express = require('express');
const session = require('express-session');



const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(loginRegister)
  .use(profileBlogs)


  app.listen(4201, () => {
    console.log('Server is running on port 4201');
  });