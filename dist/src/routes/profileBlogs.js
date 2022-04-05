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
const Blog_1 = require("../models/Blog");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.router = (0, express_1.Router)();
exports.router.get('/blogs', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.session.email;
        let username = req.session.username;
        debugger;
        const query = (0, typeorm_1.createQueryBuilder)('users', 'u').innerJoinAndSelect('u.blogs', 'b').where('u.email = :email', { email: email });
        const result = yield query.getMany();
        res.send(result);
    });
});
exports.router.post('/blogs', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, express_1.createConnection)();
        const queryRunner = connection.createQueryRunner();
        let email = req.session.email;
        let title = req.body.title;
        let content = req.body.content;
        let success = true;
        debugger;
        if (title && content) {
            yield queryRunner.connect();
            let user = queryRunner.Repository(User_1.users).findOne({ email: email });
            yield queryRunner.startTransaction();
            try {
                let blog = new Blog_1.blogs();
                blog.title = title;
                blog.content = content;
                blog.user = user;
                yield queryRunner.Repository(Blog_1.blogs).save(blog);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                success = false;
                res.send("Error");
                res.end();
            }
            //let userRepository = await getUserRepository();
            //let user = await userRepository.findOne({where: {email: email}});
            // let blogRepository = await getBlogRepository();
            // let blog = new blogs();
            // blog.title = title;
            // blog.content = content;
            // blog.user = user;
            // try{
            //     const result = await blogRepository.save(blog);
            // }
            // catch(error) {
            //     success=false;
            //     res.send("Error");
            //     res.end();
            // }  
            if (success) {
                res.redirect("/blogs");
            }
        }
        else {
            res.send("Blog title and content are required");
        }
    });
});
