import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, Link } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import RefreshHandler from './RefreshHandler';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  

  const PrivateRoute = ({ element }) => {
    if (isAuthenticated) {
      return element; 
    } else {
      return (
        <div>
          <h2>You need to be logged in to access this page</h2>
          <p>Please choose one of the options below:</p>
          <Link to="/login">Login</Link> <br />
          <Link to="/signup">Signup</Link>
        </div>
      );
    }
  };

 

  return (
    <div className="App">
      
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<PrivateRoute element={<Home />} />} />

        </Routes> 
 
    </div>
  );
}