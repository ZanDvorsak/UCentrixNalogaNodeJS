import { NextFunction, Request, Response, Router, DataSource } from 'express';
import {users } from '../models/User';
import { blogs } from '../models/Blog';
import "reflect-metadata";
import { Connection, createQueryBuilder } from 'typeorm';
import {AppDataSource } from '../../data-source';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';


export const router: Router = Router()

router.get('/blogs', async function (req: Request, res: Response, next: NextFunction) {   
        let id = req.query.id;

        const query =  await AppDataSource.createQueryBuilder('users', 'u')
        .innerJoinAndSelect('u.blogs', 'b')
        .addSelect(['b.title, b.content'])
        .where('u.id = :id', { id: id })
        .orderBy('b.id', 'ASC');

        //!!!preveri result username
        let result = await query.getMany();    
        let all :any = result[0];
        let blogs;        
        if (result.length > 0) {
            blogs = all.blogs;            
        }        
        res.send(blogs);
    }
);

router.get('/editBlog', async function (req: Request, res: Response, next: NextFunction) {   
    let idPost = req.query.postId;
    let userId = req.query.userId;
    if (userId)
    {
        const getBlogRepository = AppDataSource.getRepository(blogs);
        const result =  await getBlogRepository.findOneBy({id: idPost});
        if (result)
        {
            res.send(result);
            res.end();
        }
        else{
            res.send("Error");
            res.end();
        }

    }

}
);

router.post('/createBlog', async function (req: Request, res: Response, next: NextFunction) {

        let userId = req.body.userId;
        let title = req.body.title;
        let content = req.body.content;
        let success = true;
        if(title && content && userId) {  
            try{
                const queryRunner = await AppDataSource.createQueryRunner();
                await queryRunner.connect();
                const user = await queryRunner.manager.findOneBy(users, {id: userId});
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
   
});

router.put('/saveBlog', async function (req: Request, res: Response, next: NextFunction) {
       
        let id = req.body.id;
        let title = req.body.title;
        let content = req.body.content;
        let userId = req.body.userId;
        let success = true;  
        const getBlogRepository = await AppDataSource.getRepository(blogs);      
        debugger;
        if(title && content && userId && id){  
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
                res.status(200);
            }  
        }
        else {
            res.send("Blog title and content are required");
            res.end();
        }   

});

router.delete('/deleteBlog/:id', async function (req: Request, res: Response, next: NextFunction) { 
        let id = req.params.id;
        let success = true;  
        debugger;
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
            res.status(200);
            res.end();
        }  

});