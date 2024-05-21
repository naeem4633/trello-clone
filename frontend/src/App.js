import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import axios from 'axios';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useFirebase } from './context/firebase';
import { useNavigate } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';

function App() {
  // const [user, setUser] = useState(null);
  const firebase = useFirebase();


  return (
    <Router>
      <div className="app">
        <div className="app-body">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
