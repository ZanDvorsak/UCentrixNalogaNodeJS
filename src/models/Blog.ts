import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, ManyToMany, ManyToOne} from "typeorm"
import { Users } from "./User";
@Entity()
export class Blogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToOne(type => Users, user => user.blogs) user: Users;
    
}
