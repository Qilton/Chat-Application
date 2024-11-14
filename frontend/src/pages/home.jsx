import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { socket } from '../socket';
import { ConnectionState } from '../components/ConnectionState';
import { ConnectionManager } from '../components/ConnectionManager';
import { Events } from "../components/Events";
import { MyForm } from '../components/MyForm';

const Home = () => {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const[users,setUsers]=useState([])
  const navigate = useNavigate();
 
  useEffect(() => {
    async function users(){
      const loggedInUser = localStorage.getItem('loggedInUser');
      console.log(loggedInUser)
    const res=await fetch('http://localhost:3000/users/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
        const data=await res.json()
        console.log(data)
        const filteredUsers = data.filter(user => user.name !== loggedInUser);
        setUsers(filteredUsers)
       
    }
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

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
    onMessage()
    users()
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
    
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer />
      <ConnectionState isConnected={isConnected} />
      <div className="flex flex-1">
            <div className='w-[20vw] overflow-y-auto bg-white shadow-md rounded-md p-4 mb-4'>
              <h2 className='font-semibold text-lg'>Users</h2>
              <ul>
                {users.map((user,index)=>(
                  <li className='text-md border p-2 rounded-md shadow-md m-2 cursor-pointer' key={index}>{user.name}</li>
                ))}</ul>
            </div>
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-md p-4 mb-4">
            <h2 className="text-lg font-semibold">Chat</h2>
            <div className="space-y-2 max-h-[55vh]  ">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded-md">
                  <span className='font-bold'>{msg.user}:</span> {msg.message}
                </div>
              ))}
            </div>
          </div>
          <MyForm  messages={messages} setMessages={setMessages}/> 
        </div>
      </div>
      <ConnectionManager />
      <button onClick={handleLogout} className="bg-red-500 text-white rounded-md p-2 m-4">
        Logout
      </button>
    </div>
  );
};

export default Home;
