"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'https://172.104.145.28:80',
}));
let counter = 0;
if (fs_1.default.existsSync('./counter.txt')) {
    counter = parseInt(fs_1.default.readFileSync('./counter.txt', 'utf-8'));
}
app.get('/increment-counter', limiter, (req, res) => {
    counter++;
    fs_1.default.writeFileSync('./counter.txt', String(counter));
    return res.sendStatus(200);
});
app.get('/get-counter', (req, res) => {
    return res.status(200).json({ res: counter });
});
app.post('/set-counter', (req, res) => {
    if (req.body.code != process.env.CODE)
        return res.sendStatus(401);
    if (!Number.isInteger(Number(req.body.newCounter)))
        return res.sendStatus(400);
    counter = req.body.newCounter;
    fs_1.default.writeFileSync('./counter.txt', String(counter));
    return res.sendStatus(200);
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve('../client/index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.resolve('../client/login.html'));
});
app.post('/login', (req, res) => {
    if (req.body.code == process.env.CODE) {
        return res.sendStatus(200);
    }
    else {
        return res.sendStatus(401);
    }
});
app.get('/admin', (req, res) => {
    res.sendFile(path_1.default.resolve('../client/admin.html'));
});
app.listen(80, () => {
    console.log('Listening on port 80!');
});
