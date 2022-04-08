import { NextFunction, Request, Response, Router } from 'express';
import {users } from '../models/User';
import "reflect-metadata";
import {AppDataSource } from '../../data-source';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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
        let success = false;        
        let emailValidator = require("email-validator");
        
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let checkPassword = req.body.checkPassword;
        let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        const getUserRepository = AppDataSource.getRepository(users);
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
                const result = await getUserRepository.save(user);
                success = true;                
            }
            catch(error) {
                res.send("Username or email already exists");
                res.end();
            }      
            if(success) {
                res.status(200).send(username);
            }
        }        
    });  


router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
        let jwtSecretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY0OTM3MDIzMCwiaWF0IjoxNjQ5MzcwMjMwfQ.Ud0Jqcl-ZQ1tmj6eXu_HJzP4tZ_hwrWO9xdTS5GaFR8";
        let email = req.body.email;
        let password = req.body.password;
        let data = {
            email: email
        };

        const token = jwt.sign(data, jwtSecretKey);
        const getUserRepository = AppDataSource.getRepository(users);
        if(email && password)
        {
            let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
            let user = await getUserRepository.findOneBy({email: email, password: pass_sha});
            if(user) {
                req.session.email = email;
                req.session.username = user.username;
                res.status(200).json({
                    token: token
                });
                //res.send("login sucesfull");
                res.end();            
            }
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
    
router.get('/login', async function (req: Request, res: Response, next: NextFunction) {

});

router.get('/register', async function (req: Request, res: Response, next: NextFunction) {


});

router.get('/login/:username', async function (req: Request, res: Response, next: NextFunction) {
    res.send("Hello " + req.params.username);
    res.end();
});

router.get('/logout', async function (req: Request, res: Response, next: NextFunction) {
    req.session.destroy();
    res.redirect("/login");
    res.end();
});