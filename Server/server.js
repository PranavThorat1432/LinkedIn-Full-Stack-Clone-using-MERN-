import express from 'express';
import connectDB from './config/mongodb.js';
import 'dotenv/config';
import authRouter from './routes/authRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import connectionRouter from './routes/connectionRouter.js';
import http from 'http';
import { Server } from 'socket.io';
import notificationRouter from './routes/notificationRouter.js';


const app = express();
const PORT = 5000 || process.env.PORT;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/connection', connectionRouter);
app.use('/api/notification', notificationRouter);

app.get('/', (req, res) => {
    res.send('Server is running')
})

export const userSocketMap = new Map()

io.on('connection', (socket) => {
    // console.log('User connected: ', socket.id);

    socket.on('register', (userId) => {
        if (userId) {
            userSocketMap.set(userId, socket.id)
            // console.log(userSocketMap);
        }
    });

    socket.on('disconnect', () => {
        // Remove user from socket map when they disconnect
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
        // console.log('User disconnected: ', socket.id);
        // console.log(userSocketMap);
    })
})

// MongoDB Connnection  
connectDB();

server.listen(PORT, () => console.log(`Server is running on PORT: http://localhost:${PORT}`));