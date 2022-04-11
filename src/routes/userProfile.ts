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
            if(user == null){
                const userWithoutJob = await queryRunner.manager.findOne(users, {where: {id: userId}});
                userWithoutJob.jobTitle = "";
                data = {
                    user: userWithoutJob,
                    jobTitles: jobTitles
                } 
            }
            else {                
                data = {
                    user: user,
                    jobTitles: jobTitles
                }
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

router.delete('/deleteUser/:id', async function (req: Request, res: Response, next: NextFunction) {
    let id = req.params.id;
    let success = true;
    debugger;
        try{
            const getUserRepository = await AppDataSource.getRepository(users);
            const user = await getUserRepository.findOneBy({id: id});
            await getUserRepository.remove(user);
        }
        catch(err) {
            success = false;
            console.log(err);
        }
        if(success) {
            res.status(200);
        }
        else {
            res.send("Error");
            res.end();
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
    let biography = req.body.biography;
    let success = true;
    debugger;
        try{
            const getUserRepository = await AppDataSource.getRepository(users);
            const user = await getUserRepository.findOneBy({id: id});

            if(firstName != "" && firstName != null && firstName != undefined)
            user.firstName = req.body.firstName;
            if(lastName != "" && lastName != null && lastName != undefined)
            user.lastName = req.body.lastName;
            if(jobTitle != 0 && jobTitle != null && jobTitle != undefined)
            user.jobTitle = req.body.jobTitle;
            if(phoneNumber != "" && phoneNumber != null && phoneNumber != undefined)
            user.phoneNumber = req.body.phoneNumber;
            if(age != 0 && age != null && age != undefined)
            user.age = req.body.age;
            if(gender != 0 && gender != null && gender != undefined)
            user.gender = req.body.gender;
            if(biography != "" && biography != null && biography != undefined)
            user.biography = req.body.biography;
            if(website != "" && website != null && website != undefined)
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
