import "reflect-metadata"
import { DataSource } from "typeorm"
import { blogs } from "./src/models/Blog"
import { jobTitle } from "./src/models/JobTitles"
import { users } from  "./src/models/User"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "Cdzan",
    password: "admin123",
    database: "postgres",
    entities: [users, blogs, jobTitle],
    synchronize: true,
    logging: false
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })