import React, { useState } from 'react';
import { socket } from '../socket';

export const MyForm = ({messages,setMessages}) => {
  const username = localStorage.getItem('loggedInUser');
  const [message, setMessage] = useState('');

  const onMessage = async () => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); 
      console.log(messages); 
      setMessages(data); 
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '' && username) {
      // Emit the message to the server
      socket.emit('create-something', { username, message }, () => {
        console.log('Message sent successfully');
      });
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
        className="flex-1 border rounded-md p-2 mr-2"
      />
      <button onClick={onMessage} type="submit" className="bg-blue-500 text-white rounded-md p-2">
        Submit
      </button>
    </form>
  );
};
