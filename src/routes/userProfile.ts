import { NextFunction, Request, Response, Router, DataSource } from 'express';
import {users } from '../models/User';
import "reflect-metadata";
import { Connection, createQueryBuilder } from 'typeorm';
import {AppDataSource } from '../../data-source';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';
import { jobTitle } from '../models/JobTitles';


export const router: Router = Router()

router.get('/editProfile', async function (req: Request, res: Response, next: NextFunction) {
    let email = req.session.email;
    let success = true;
    let data;
    if(email) {
        try{
            const queryRunner = await AppDataSource.createQueryRunner();
            await queryRunner.connect();
            const jobTitles = await queryRunner.manager.find(jobTitle);
            const user = await queryRunner.manager.findOneBy(users, {email: email});
    
            data = {
                jobTitles: jobTitles,
                user: user
            }
        }
        catch(err) {
            success = false;
            console.log(err);
        }
        if(success) {
            res.send(data);
        }
        else {
            res.send("Error");
        }
    }  
    else{
        res.redirect("/login");
    }       
});

router.delete('/editProfile/delete', async function (req: Request, res: Response, next: NextFunction) {
    let email = req.session.email;
    let success = true;
    if(email) {
        try{
            const getUserRepository = await AppDataSource.getRepository(users);
            const user = await getUserRepository.findOneBy({email: email});
            await getUserRepository.remove(user);
        }
        catch(err) {
            success = false;
            console.log(err);
        }
        if(success) {
            res.send("Success");
        }
        else {
            res.send("Error");
        }
    }  
    else{
        res.redirect("/login");
    }       
});

router.put('/editProfile/update', async function (req: Request, res: Response, next: NextFunction) {
    let email = req.session.email;
    let success = true;
    if(email) {
        try{
            const getUserRepository = await AppDataSource.getRepository(users);
            const user = await getUserRepository.findOneBy({email: email});
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.jobTitle = req.body.jobTitle;
            user.phoneNumber = req.body.phoneNumber;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.biography = req.body.biography;
            user.website = req.body.website;
            await getUserRepository.save(user);
        }
        catch(err) {
            success = false;
            console.log(err);
        }
        if(success) {
            res.redirect("/editProfile");
        }
        else {
            res.send("Error");
            res.end();
        }
    }  
    else{
        res.redirect("/login");
    }       
});
