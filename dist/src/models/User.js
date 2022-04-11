"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const typeorm_1 = require("typeorm");
const Blog_1 = require("./Blog");
const JobTitles_1 = require("./JobTitles");
let users = class users {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], users.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], users.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], users.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => JobTitles_1.jobTitle, jobtitle => jobtitle.users, { nullable: true }),
    __metadata("design:type", String)
], users.prototype, "jobTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], users.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], users.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", Number)
], users.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", Number)
], users.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], users.prototype, "biography", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Blog_1.blogs, blog => blog.user, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], users.prototype, "blogs", void 0);
users = __decorate([
    (0, typeorm_1.Entity)()
], users);
exports.users = users;
let connection;
// export async function getUserRepository(): Promise<Repository<users>> {
//     if (connection===undefined) {
//       connection = await createConnection({
//         type: "postgres",
//         host: "localhost",
//         port: 5432,
//         username: "Cdzan",
//         password: "admin123",
//         database: "UCentrixNaloga",
//         synchronize: true,
//         logging: false,
//         entities: [
//             users, blogs
//         ],
//       });
//     }
//     return connection.getRepository(users);
// }
