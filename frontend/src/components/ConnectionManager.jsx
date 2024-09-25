import React,{useState} from 'react';
import { socket } from '../socket';
import RefrshHandler from '../RefreshHandler';
export function ConnectionManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


setIsAuthenticated?socket.connect():socket.disconnect();

  return (
    <>
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
    </>
  );
}