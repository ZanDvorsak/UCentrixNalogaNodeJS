import { NextFunction, Request, Response, Router } from 'express';
import {getUserRepository, users } from '../models/User';
import "reflect-metadata";

export const router: Router = Router()

const crypto = require('crypto');
const session = require('express-session');

router.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true
    })
  );

router.post('/register', async function (req: Request, res: Response, next: NextFunction) {
        const userRepository = await getUserRepository();
        let success = true;        
        let emailValidator = require("email-validator");
        
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let checkPassword = req.body.checkPassword;
        let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        
        if(!emailValidator.validate(email))
        {
            res.send("Invalid email");
        }
        else if(password.length < 8 || password === "") {
            res.send("Password must be at least 8 characters long");
            res.end();
        }
        else if(password !== checkPassword) {
            res.send("Passwords do not match");
            res.end();
        }
        else {
            let user = new users();
            user.email = email;
            user.username = username;
            user.password = pass_sha;
            user.firstName = firstName;
            user.lastName = lastName; 
            try{
                const result = await userRepository.save(user);
            }
            catch(error) {
                success=false;
                res.send("Username or email already exists");
                res.end();
            }      
            if(success) {
                res.redirect("/login");
            }
        }        
    });  


router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
   
        let email = req.body.email;
        let password = req.body.password;
        let userRepository = await getUserRepository();
        if(email && password)
        {
            let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
            let user = await userRepository.findOne({where: {email: email, password: pass_sha}});
            if(user) {
                req.session.email = email;
                req.session.username = user.username;
                res.redirect("/blogs");
                //res.send("login sucesfull");
            res.end();            }
            else {
                res.send("Invalid email or password");
                res.end();
            }
        }
        else{
            res.send("invalid email or password");
            res.end()
        } 
    });     