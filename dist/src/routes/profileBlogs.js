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
const data_source_1 = require("../../data-source");
exports.router = (0, express_1.Router)();
exports.router.get('/blogs', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.email) {
            let email = req.session.email;
            let username = req.session.username;
            const query = yield data_source_1.AppDataSource.createQueryBuilder('users', 'u')
                .innerJoinAndSelect('u.blogs', 'b')
                .addSelect(['b.title, b.content'])
                .where('u.email = :email', { email: email })
                .orderBy('b.id', 'ASC');
            let result = yield query.getMany();
            let blogs = result[0];
            let data;
            if (result.length > 0) {
                blogs = blogs.blogs;
                data = {
                    username: username,
                    blogs: blogs
                };
            }
            else {
                data = {
                    username: username,
                };
            }
            res.send(data);
        }
        else {
            res.send("You are not logged in");
        }
    });
});
exports.router.post('/blogs', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.email) {
            let email = req.session.email;
            let title = req.body.title;
            let content = req.body.content;
            let success = true;
            if (title && content) {
                try {
                    const queryRunner = yield data_source_1.AppDataSource.createQueryRunner();
                    yield queryRunner.connect();
                    const user = yield queryRunner.manager.findOneBy(User_1.users, { email: email });
                    let blog = new Blog_1.blogs();
                    blog.title = title;
                    blog.content = content;
                    blog.user = user;
                    yield queryRunner.startTransaction();
                    yield queryRunner.manager.save(blog);
                    try {
                        yield queryRunner.commitTransaction();
                    }
                    catch (error) {
                        success = false;
                        yield queryRunner.rollbackTransaction();
                    }
                    // await AppDataSource.transaction(async (transaction) => {
                    //     let user = await transaction.findOneBy(users, {email: email});   
                    //     debugger;
                    //     await transaction.save(blog);
                    // });
                }
                catch (error) {
                    success = false;
                    res.send("Error");
                    res.end();
                }
                if (success) {
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
});
exports.router.put('/blogs/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.email) {
            let id = req.params.id;
            let title = req.body.title;
            let content = req.body.content;
            let success = true;
            const getBlogRepository = yield data_source_1.AppDataSource.getRepository(Blog_1.blogs);
            debugger;
            if (title && content) {
                try {
                    const blog = yield getBlogRepository.findOneBy({ id: id });
                    blog.title = title;
                    blog.content = content;
                    yield getBlogRepository.save(blog);
                }
                catch (error) {
                    success = false;
                    res.send("Error");
                    res.end();
                }
                if (success) {
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
});
exports.router.delete('/blogs/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.session.email) {
            let id = req.params.id;
            let success = true;
            const getBlogRepository = yield data_source_1.AppDataSource.getRepository(Blog_1.blogs);
            try {
                const blog = yield getBlogRepository.findOneBy({ id: id });
                yield getBlogRepository.remove(blog);
            }
            catch (error) {
                success = false;
                res.send("Error");
                res.end();
            }
            if (success) {
                res.redirect("/blogs");
            }
        }
        else {
            res.redirect("/login");
        }
    });
});
