"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRegister_1 = require("./src/routes/loginRegister");
const profileBlogs_1 = require("./src/routes/profileBlogs");
const userProfile_1 = require("./src/routes/userProfile");
const express = require('express');
const session = require('express-session');
const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(loginRegister_1.router)
    .use(profileBlogs_1.router)
    .use(userProfile_1.router);
app.listen(4201, () => {
    console.log('Server is running on port 4201');
});
