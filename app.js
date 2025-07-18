import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", function (req, res) {
    res.render("index");  
});

// Socket.IO logic
io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location",{id:socket.id, ...data})
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected",socket.id)
    })
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
