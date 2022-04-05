import { NextFunction, Request, Response, Router } from 'express';
import {getUserRepository, users } from '../models/User';
import { getBlogRepository, blogs } from '../models/Blog';
import "reflect-metadata";
import { Connection, createQueryBuilder } from 'typeorm';


export const router: Router = Router()

router.get('/blogs', async function (req: Request, res: Response, next: NextFunction) {
    let email = req.session.email;
    let username = req.session.username;
    debugger;
    const query = createQueryBuilder('users', 'u').innerJoinAndSelect('u.blogs', 'b').where('u.email = :email', { email: email });
    const result = await query.getMany();
    res.send(result);
});

router.post('/blogs', async function (req: Request, res: Response, next: NextFunction) {
    let email = req.session.email;
    let title = req.body.title;
    let content = req.body.content;
    let success = true;
    debugger;
    
    if(title && content) {
        let userRepository = await getUserRepository();
        let user = await userRepository.findOne({where: {email: email}});
        
        let blogRepository = await getBlogRepository();
        let blog = new blogs();
        blog.title = title;
        blog.content = content;
        blog.user = user;
        try{
            const result = await blogRepository.save(blog);
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
    }
});