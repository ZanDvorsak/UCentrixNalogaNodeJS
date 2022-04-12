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
        let id = req.query.id;
        let user = yield data_source_1.AppDataSource.createQueryBuilder(User_1.users, 'u')
            .select('u.username')
            .where('u.id = :id', { id: id }).getOne();
        const query = yield data_source_1.AppDataSource.createQueryBuilder('users', 'u')
            .innerJoinAndSelect('u.blogs', 'b')
            .addSelect(['b.title, b.content'])
            .where('u.id = :id', { id: id })
            .orderBy('b.id', 'ASC');
        let result = yield query.getMany();
        let all = result[0];
        let blogCount = 0;
        if (all != undefined) {
            blogCount = all.blogs.length;
        }
        let blogs;
        if (result.length > 0) {
            blogs = all.blogs;
        }
        let data = {
            blogs: blogs,
            username: user.username,
            blogCount: blogCount
        };
        res.send(data);
    });
});
exports.router.get('/editBlog', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let idPost = req.query.postId;
        let userId = req.query.userId;
        if (userId) {
            const getBlogRepository = data_source_1.AppDataSource.getRepository(Blog_1.blogs);
            const result = yield getBlogRepository.findOneBy({ id: idPost });
            if (result) {
                res.send(result);
                res.end();
            }
            else {
                res.send("Error");
                res.end();
            }
        }
    });
});
exports.router.post('/createBlog', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.body.userId;
        let title = req.body.title;
        let content = req.body.content;
        let success = true;
        if (title && content && userId) {
            try {
                const queryRunner = yield data_source_1.AppDataSource.createQueryRunner();
                yield queryRunner.connect();
                const user = yield queryRunner.manager.findOneBy(User_1.users, { id: userId });
                let blog = new Blog_1.blogs();
                blog.title = title;
                blog.content = content;
                blog.user = user;
                yield queryRunner.manager.save(blog);
            }
            catch (error) {
                res.status(500);
                res.end();
            }
            if (success) {
                res.status(200);
                res.end();
            }
        }
        else {
            res.send("Blog title and content are required");
            res.end();
        }
    });
});
exports.router.put('/saveBlog', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.body.id;
        let title = req.body.title;
        let content = req.body.content;
        let userId = req.body.userId;
        let success = true;
        const getBlogRepository = yield data_source_1.AppDataSource.getRepository(Blog_1.blogs);
        debugger;
        if (title && content && userId && id) {
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
                res.status(200);
            }
        }
        else {
            res.send("Blog title and content are required");
            res.end();
        }
    });
});
exports.router.delete('/deleteBlog/:id', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        let success = true;
        debugger;
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
            res.status(200);
            res.end();
        }
    });
});
