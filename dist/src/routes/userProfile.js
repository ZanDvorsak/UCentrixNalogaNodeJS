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
const JobTitles_1 = require("../models/JobTitles");
exports.router = (0, express_1.Router)();
exports.router.get('/editUser', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let success = true;
        let userId = req.query.userId;
        let data;
        try {
            const queryRunner = yield data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            const jobTitles = yield queryRunner.manager.find(JobTitles_1.jobTitle);
            const user = yield queryRunner.manager.createQueryBuilder(User_1.users, 'u')
                .innerJoin('u.jobTitle', 'j')
                .addSelect('j.title')
                .where('u.id = :id', { id: userId }).getOne();
            data = {
                user: user,
                jobTitles: jobTitles
            };
        }
        catch (err) {
            success = false;
            console.log(err);
        }
        if (success) {
            res.send(data);
            res.end();
        }
        else {
            res.status(500);
            res.end();
        }
    });
});
exports.router.delete('/editProfile/delete', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.session.email;
        let success = true;
        if (email) {
            try {
                const getUserRepository = yield data_source_1.AppDataSource.getRepository(User_1.users);
                const user = yield getUserRepository.findOneBy({ email: email });
                yield getUserRepository.remove(user);
            }
            catch (err) {
                success = false;
                console.log(err);
            }
            if (success) {
                res.send("Success");
            }
            else {
                res.send("Error");
            }
        }
        else {
            res.redirect("/login");
        }
    });
});
exports.router.put('/saveProfile', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.body.id;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let website = req.body.website;
        let jobTitle = req.body.jobTitle;
        let phoneNumber = req.body.phoneNumber;
        let age = req.body.age;
        let gender = req.body.gender;
        let success = true;
        debugger;
        try {
            const getUserRepository = yield data_source_1.AppDataSource.getRepository(User_1.users);
            const user = yield getUserRepository.findOneBy({ id: id });
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.jobTitle = req.body.jobTitle;
            user.phoneNumber = req.body.phoneNumber;
            user.age = req.body.age;
            user.gender = req.body.gender;
            user.biography = req.body.biography;
            user.website = req.body.website;
            yield getUserRepository.save(user);
        }
        catch (err) {
            success = false;
            res.send("Error");
            res.end();
        }
        if (success) {
            res.status(200);
            res.end();
        }
        else {
            res.send("Error");
            res.end();
        }
    });
});
