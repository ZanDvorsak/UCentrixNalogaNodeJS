"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
require("reflect-metadata");
const data_source_1 = require("../../data-source");
exports.router = (0, express_1.Router)();
const crypto = require('crypto');
const session = require('express-session');
exports.router.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
}));
exports.router.post('/register', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let success = true;
        let emailValidator = require("email-validator");
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let checkPassword = req.body.checkPassword;
        let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        const getUserRepository = data_source_1.AppDataSource.getRepository(User_1.users);
        if (!emailValidator.validate(email)) {
            res.send("Invalid email");
        }
        else if (password.length < 8 || password === "") {
            res.send("Password must be at least 8 characters long");
            res.end();
        }
        else if (password !== checkPassword) {
            res.send("Passwords do not match");
            res.end();
        }
        else {
            let user = new User_1.users();
            user.email = email;
            user.username = username;
            user.password = pass_sha;
            user.firstName = firstName;
            user.lastName = lastName;
            try {
                const result = yield getUserRepository.save(user);
            }
            catch (error) {
                success = false;
                res.send("Username or email already exists");
                res.end();
            }
            if (success) {
                res.redirect("/login/" + username);
            }
        }
    });
});
exports.router.post('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.body.email;
        let password = req.body.password;
        const getUserRepository = data_source_1.AppDataSource.getRepository(User_1.users);
        if (email && password) {
            let pass_sha = crypto.createHash('sha256').update(password).digest('hex');
            let user = yield getUserRepository.findOneBy({ email: email, password: pass_sha });
            if (user) {
                req.session.email = email;
                req.session.username = user.username;
                res.redirect("/blogs");
                //res.send("login sucesfull");
                res.end();
            }
            else {
                res.send("Invalid email or password");
                res.end();
            }
        }
        else {
            res.send("invalid email or password");
            res.end();
        }
    });
});
exports.router.get('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
    });
});
exports.router.get('/login/:username', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.send("Hello " + req.params.username);
        res.end();
    });
});
