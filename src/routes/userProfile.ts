import { NextFunction, Request, Response, Router, DataSource } from 'express';
import {users } from '../models/User';
import "reflect-metadata";
import { Connection, createQueryBuilder } from 'typeorm';
import {AppDataSource } from '../../data-source';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';
import { jobTitle } from '../models/JobTitles';


export const router: Router = Router()

router.get('/editUser', async function (req: Request, res: Response, next: NextFunction) {
    let success = true;
    let userId = req.query.userId;
    let data;
        try{
           
            const queryRunner = await AppDataSource.createQueryRunner();
            await queryRunner.connect();            
            const jobTitles =  await queryRunner.manager.find(jobTitle);
            const user = await queryRunner.manager.createQueryBuilder(users, 'u')
            .innerJoin('u.jobTitle', 'j')
            .addSelect('j.title')
            .where('u.id = :id', { id: userId }).getOne();
            data = {
                user: user,
                jobTitles: jobTitles
            }    
            
        }
        catch(err) {
            success = false;
            console.log(err);
        }
        if(success) {
            res.send(data);
            res.end();
        }
        else {
            res.status(500);
            res.end();
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

router.put('/saveProfile', async function (req: Request, res: Response, next: NextFunction) {
    let id = req.body.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let website = req.body.website;
    let jobTitle = req.body.jobTitle;
    let phoneNumber = req.body.phoneNumber;
    let age = req.body.age;
    let gender = req.body.gender;
    let success = true;
    debugger;
        try{
            const getUserRepository = await AppDataSource.getRepository(users);
            const user = await getUserRepository.findOneBy({id: id});
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
            res.send("Error");
            res.end();
        }
        if(success) {
            res.status(200);
            res.end();
        }
        else {
            res.send("Error");
            res.end();
        }
    
});
