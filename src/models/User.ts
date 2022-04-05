import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, OneToMany} from "typeorm"
import { Blogs } from "./Blog"

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({
        nullable: true
    })
    jobTitle: string

    @Column({
        nullable: true
    })
    website: string
    
    @Column({
        nullable: true
    })
    phoneNumber: number

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

    @OneToMany(type => Blogs, blog => blog.user) blogs: Blogs[];

}
