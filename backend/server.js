const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const AuthRouter=require('./routes/AuthRouter')
const Message = require('./models/message');
const UserRouter=require('./routes/UserRouter')
require('dotenv').config()
require('./models/db')
app.use(cors(
    {
        origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],}
    
));
app.use(express.json());
app.use('/auth',AuthRouter)
app.use('/users',UserRouter)

// Setup for express and socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'] // Typically, your React app runs on port 3000 in dev
    }
});


io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    

    socket.on('joinRoom', ({ roomId, username }) => {
        socket.join(roomId);
        console.log(`${username} joined room: ${roomId}`);
        
        // Optionally send a message to other users in the room
        socket.to(roomId).emit('userJoined', `${username} has joined the room`);
    });

    // Listen for a message in the room
    socket.on('privateMessage', ({ roomId, message, sender }) => {
        // Send the message to all users in the room
        io.to(roomId).emit('message', { message, sender });
    });

    
    socket.on('create-something', async (data, callback) => {
        try {
            console.log(data)
            const newMessage = new Message({ user:data.username,message: data.message });
            await newMessage.save();
            console.log('Message saved to database:', data.message);

            socket.broadcast.emit('foo', data.message);
            callback();
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });
});
app.get('/', async (req, res) => {
    try {
        const messages = await Message.find(); 
  
        res.send(messages); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); 
    }
});


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
