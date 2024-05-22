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
  // const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([
    { name: 'Board 1', tasks: [{ id: 1, name: 'Task 1' }, { id: 2, name: 'Task 2' }] },
    { name: 'Board 2', tasks: [] },
    { name: 'Board 3', tasks: [] },
  ]);

    useEffect(() => {
      const fetchBoards = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/boards');
          const data = await response.json();
          setBoards(data);
        } catch (error) {
          console.error('Error fetching boards:', error);
        }
    };
  
      fetchBoards();
    }, []);
  
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/tasks');
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
  
      fetchTasks();
    }, []); 

    const onDropTask = (task, boardName) => {
      const boardIndex = boards.findIndex(board => board.name === boardName);
    
      const previousBoardIndex = boards.findIndex(board => board.tasks.some(t => t._id === task.id));
    
      const updatedBoards = [...boards];
    
      if (previousBoardIndex !== -1) {
        const taskIndex = updatedBoards[previousBoardIndex].tasks.findIndex(t => t._id === task.id);
        if (taskIndex !== -1) {
          updatedBoards[previousBoardIndex].tasks.splice(taskIndex, 1);
        }
      }
    
      updatedBoards[boardIndex].tasks.push(task);
    
      setBoards(updatedBoards);
    };

    useEffect(() => {
      console.log('Boards:', boards);
    }, [boards]);
  
    useEffect(() => {
      console.log('Tasks:', tasks);
    }, [tasks]);

  return (
    <Router>
      <div className="app">
        <div className="app-body">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home boards={boards} setBoards={setBoards} tasks={tasks} setTasks={setTasks} onDropTask={onDropTask}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
