"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])({
    origin: 'localhost:3000'
}));
var counter = 0;
if (fs_1["default"].existsSync('./counter.txt')) {
    counter = parseInt(fs_1["default"].readFileSync('./counter.txt', 'utf-8'));
}
app.get('/counter', function (req, res) {
    counter++;
    fs_1["default"].writeFileSync('./counter.txt', String(counter));
    return res.status(200).json({ res: counter });
});
app.get('/', function (req, res) {
    res.sendFile(path_1["default"].resolve('../client/index.html'));
});
app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
