import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, ManyToMany, ManyToOne} from "typeorm"
import { users } from "./User";
@Entity()
export class blogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(type => users, user => user.blogs) 
    user: users;    
}

let connection:Connection;

// export async function getBlogRepository(): Promise<Repository<blogs>> {
//     if (connection===undefined) {
//       connection = await createConnection({
//         type: "postgres",
//         host: "localhost",
//         port: 5432,
//         username: "Cdzan",
//         password: "admin123",
//         database: "UCentrixNaloga",
//         synchronize: true,
//         logging: false,
//         entities: [
//             blogs, users
//         ],
//       });
//     }
//     return connection.getRepository(blogs);
//   }

