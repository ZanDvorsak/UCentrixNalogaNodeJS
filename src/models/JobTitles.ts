import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, Repository, ManyToMany, ManyToOne, OneToMany} from "typeorm"
import { users } from "./User";

@Entity()
export class jobTitle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(type => users, user => user.jobTitle, {onDelete: 'CASCADE' })
    users: users[]; 

}