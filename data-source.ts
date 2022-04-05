import "reflect-metadata"
import { DataSource } from "typeorm"
import { Blogs } from "./src/Blog"
import { Users } from "./src/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "Cdzan",
    password: "admin123",
    database: "UCentrixNaloga",
    synchronize: true,
    logging: false,
    entities: [Users, Blogs],
    migrations: [],
    subscribers: [],
})
