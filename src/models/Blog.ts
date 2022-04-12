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

    @ManyToOne(type => users, user => user.blogs, {onDelete: 'CASCADE' }) 
    user: users;    
}


