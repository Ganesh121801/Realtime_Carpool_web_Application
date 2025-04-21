const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');
let io;
const messageModel = require('./models/message.model')
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });
        socket.on('new-ride', async (data) => {
            try {
              const captain = await captainModel.findById(data.captainId);
              if (captain && captain.socketId) {
                // Make sure all required data is populated
            const rideData = await rideModel.findById(data.rideId)
            .populate('user')
            .populate('captain');
            
        io.to(captain.socketId).emit('new-ride', {
            event: 'new-ride',
            data: rideData
        });
              }
            } catch (error) {
              console.error('Error handling rideshare request:', error);
            }
          });

          socket.on('message', async (data) => {
            const { senderId, receiverId, message } = data;
        
            if (!senderId || !receiverId || !message) {
                console.error('Invalid message data:', data);
                return;
            }
        
            try {
                // Try to find receiver in both user and captain collections
                let receiver = await userModel.findById(receiverId);
                if (!receiver) {
                    receiver = await captainModel.findById(receiverId);
                }
                if (!receiver || !receiver.socketId) {
                    console.error('Receiver not found or not connected:', receiverId);
                    return;
                }
        
                const savedMessage = await messageModel.create({
                    sender: senderId,
                    receiver: receiverId,
                    message,
                    timestamp: new Date(),
                });
        
                // Send to receiver
                io.to(receiver.socketId).emit('message', savedMessage);
                // Optionally, also send to sender for instant feedback
                io.to(socket.id).emit('message', savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}


const init = (server) => {
    io = initializeSocket(server);
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};



module.exports = { initializeSocket, sendMessageToSocketId ,init,
    getIO };