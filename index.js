const express = require("express");

// dùng để truyền dữ liệu từ FE -> BE
const bodyParser = require("body-parser");

// dùng để hiển thị thông báo
const flash = require("express-flash");

// moment chuyển dạng số Date thành ngày bình thường
const moment = require("moment");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");

//nhung dotenv
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

//socket
const http = require('http');
const { Server } = require("socket.io");

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express(); //app la toan bo chuong trinh
const port = process.env.PORT;

//socket
const server = http.createServer(app);
const io = new Server(server);

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Khai báo biến toàn cục cho file pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Khai báo biến toàn cục cho file js backend
global._io = io;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Flash
app.use(cookieParser("JKSLSF"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//dung duoc file tinh
// app.use(express.static("public")); local
app.use(express.static(`${__dirname}/public`)); // local và online

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//Routes
routeClient(app);
routeAdmin(app);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
