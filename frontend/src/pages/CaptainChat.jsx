import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';

const CaptainChat = ({ userId }) => {
    const { socket } = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };
        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const messageObj = {
                senderId: localStorage.getItem('captainId'),
                receiverId: userId,
                message: newMessage,
                timestamp: new Date().toISOString(),
            };
            socket.emit('message', messageObj);
            setNewMessage('');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg flex flex-col h-96 border border-gray-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 rounded-t-xl">
                {messages.map((msg, idx) => {
                    const isSent = msg.senderId === localStorage.getItem('captainId');
                    return (
                        <div
                            key={idx}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                                    isSent
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                            >
                                {msg.message}
                                <div className="text-[10px] text-right mt-1 opacity-60">
                                    {msg.timestamp
                                        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t flex gap-2 bg-white rounded-b-xl">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default CaptainChat;