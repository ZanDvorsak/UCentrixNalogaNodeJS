import { NextFunction, Request, Response, Router } from 'express';
import { AppDataSource } from "../data-source";
import { Users } from './models/user';
import "reflect-metadata"
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';

export const router: Router = Router();

router.post('/register', async function (req: Request, res: Response, next: NextFunction) {
    AppDataSource.initialize().then(async connection => {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
    
        let user = new Users();
        user.email = email;
        user.username = username;
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName; 

        await AppDataSource.manager.save(user);
        
    }).catch(err => {
        console.log(err);
    })   
});

router.get('/login', async function (req: Request, res: Response, next: NextFunction) {
    await AppDataSource.initialize().then(async connection => {
        let email = req.body.email;
        let password = req.body.password;
        const user = await AppDataSource.manager.findOneBy(Users, { email: email, password: password });
        if (user != null) {
            res.send(user);
        } else {
            res.send("User not found");
        }
    });        
});