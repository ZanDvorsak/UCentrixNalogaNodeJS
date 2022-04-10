"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Blog_1 = require("./src/models/Blog");
const User_1 = require("./src/models/User");
const JobTitles_1 = require("./src/models/JobTitles");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "Cdzan",
    password: "admin123",
    database: "postgres",
    entities: [User_1.users, Blog_1.blogs, JobTitles_1.jobTitle],
    synchronize: true,
    logging: false
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
