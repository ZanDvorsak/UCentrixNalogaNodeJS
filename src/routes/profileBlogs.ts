import { NextFunction, Request, Response, Router, DataSource } from 'express';
import {users } from '../models/User';
import { blogs } from '../models/Blog';
import "reflect-metadata";
import { Connection, createQueryBuilder } from 'typeorm';
import {AppDataSource } from '../../data-source';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';


export const router: Router = Router()

router.get('/blogs', async function (req: Request, res: Response, next: NextFunction) {
    if(req.session.email)
    {    
        let email = req.session.email;
        let username = req.session.username;

        const query =  await AppDataSource.createQueryBuilder('users', 'u')
        .innerJoinAndSelect('u.blogs', 'b')
        .addSelect(['b.title, b.content'])
        .where('u.email = :email', { email: email })
        .orderBy('b.id', 'ASC');

        let result = await query.getMany();    
        let blogs :any = result[0];
        let data;        
        if (result.length > 0) {
            blogs = blogs.blogs;
            data = {
                username: username,
                blogs: blogs
            } 
        }
        else {
            data = {
                username: username,
            }
        }       
        res.send(data);
    }
    else {
        res.send("You are not logged in");
    }
});

router.post('/blogs', async function (req: Request, res: Response, next: NextFunction) {
    if(req.session.email)
    {
        let email = req.session.email;
        let title = req.body.title;
        let content = req.body.content;
        let success = true;
        if(title && content) {  
            try{
                const queryRunner = await AppDataSource.createQueryRunner();
                await queryRunner.connect();
                const user = await queryRunner.manager.findOneBy(users, {email: email});
                let blog = new blogs();
                blog.title = title;
                blog.content = content;
                blog.user = user;
                await queryRunner.startTransaction();
                await queryRunner.manager.save(blog);
                try{
                    await queryRunner.commitTransaction();
                }catch(error) {
                    success=false;
                    await queryRunner.rollbackTransaction();
                }
                
                // await AppDataSource.transaction(async (transaction) => {
                //     let user = await transaction.findOneBy(users, {email: email});   
                
                //     debugger;
                //     await transaction.save(blog);
                // });
            }
            catch(error) {
                success=false;
                res.send("Error");
                res.end();
            }
            if(success) {
                res.redirect("/blogs");
            }  
        }
        else {
            res.send("Blog title and content are required");
            res.end();
        }
    }
    else {
        res.redirect("/login");
    }    
});

router.put('/blogs/:id', async function (req: Request, res: Response, next: NextFunction) {
    if(req.session.email) {    
        let id = req.params.id;
        let title = req.body.title;
        let content = req.body.content;
        let success = true;  
        const getBlogRepository = await AppDataSource.getRepository(blogs);      
        debugger;
        if(title && content) {  
            try{
                const blog = await getBlogRepository.findOneBy({id: id});
                blog.title = title;
                blog.content = content;
                await getBlogRepository.save(blog);
            }
            catch(error) {
                success=false;
                res.send("Error");
                res.end();
            }
            if(success) {
                res.redirect("/blogs");
            }  
        }
        else {
            res.send("Blog title and content are required");
            res.end();
        }
    }
    else {
        res.redirect("/login");
    }
});

router.delete('/blogs/:id', async function (req: Request, res: Response, next: NextFunction) {
    if(req.session.email) {    
        let id = req.params.id;
        let success = true;  
        const getBlogRepository = await AppDataSource.getRepository(blogs);     
        try{
            const blog = await getBlogRepository.findOneBy({id: id});
            await getBlogRepository.remove(blog);
        }
        catch(error) {
            success=false;
            res.send("Error");
            res.end();
        }
        if(success) {
            res.redirect("/blogs");
        }  
    }
    else {
        res.redirect("/login");
    }
});