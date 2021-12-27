import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);  // http Server

const sockets = [];

const wss = new WebSocket.Server({server}); //WebSocket Server

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "noname";
    console.log("Connected to Browsers");
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
            default:
        }
    });
    socket.on("close", () => console.log("Disconnected from the Browser"));
});

server.listen(3000, handleListen);
