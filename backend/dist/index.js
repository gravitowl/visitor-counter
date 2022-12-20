"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://172.104.145.28',
}));
let counter = 0;
if (fs_1.default.existsSync('./counter.txt')) {
    counter = parseInt(fs_1.default.readFileSync('./counter.txt', 'utf-8'));
}
app.get('/counter', (req, res) => {
    counter++;
    fs_1.default.writeFileSync('./counter.txt', String(counter));
    return res.status(200).json({ res: counter });
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve('../client/index.html'));
});
app.listen(80, () => {
    console.log('Listening on port 80!');
});
