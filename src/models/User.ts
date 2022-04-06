import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, OneToMany, ManyToOne, BaseEntity} from "typeorm"
import { blogs } from "./Blog"
import { jobTitle } from "./JobTitles"

@Entity()
export class users{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    email: string

    @Column({
        unique: true
    })
    username: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @ManyToOne(type => jobTitle, jobtitle => jobtitle.users, {nullable: true})
    jobTitle: string

    @Column({
        nullable: true
    })
    website: string
    
    @Column({
        nullable: true
    })
    phoneNumber: string

    @Column({
        nullable: true
    })
    gender: number  

    @Column({
        nullable: true
    })
    age: number

    @Column({
        nullable: true
    })
    biography: string

    @OneToMany(type => blogs, blog => blog.user) 
    blogs: blogs[];

}

let connection:Connection;

// export async function getUserRepository(): Promise<Repository<users>> {
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
//             users, blogs
//         ],
//       });
//     }
//     return connection.getRepository(users);
// }
