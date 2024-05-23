import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useFirebase } from './context/firebase';
import ErrorPage from './pages/ErrorPage';
import TaskList from './pages/TaskList';

function App() {
  const [user, setUser] = useState(null);
  const firebase = useFirebase();
  const {getAllBoards, getAllTasks, updateTask } = useFirebase();
  const [boards, setBoards] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState({
    message: '',
    visible: false
  });

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ message: '', visible: false });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  useEffect(() => {
    const unsubscribe = firebase.getAuth().onAuthStateChanged(async user => {
      if (!user) {
        console.log('No user is signed in.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        setUser(user);
        console.log(`${user.email} is signed in.`);
      }
    });
  
    return unsubscribe;
  }, [firebase]);

  
  useEffect(() => {
    const fetchBoardsAndTasks = async () => {
      try {
        const boardsData = await getAllBoards();
        const tasksData = await getAllTasks();
        setBoards(boardsData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching boards and tasks:", error);
      }
    };
  
    fetchBoardsAndTasks();
  }, []);


  useEffect(() => {
    const isScreenMobile = window.innerWidth <= 700;
    setIsMobile(isScreenMobile);
  }, []);

  const onDropTask = async (task, boardName) => {
    const boardIndex = boards.findIndex(board => board.name === boardName);
    if (boardIndex === -1) return;
  
    const previousBoardIndex = boards.findIndex(board => board.tasks.some(t => t.id === task.id));
    if (previousBoardIndex === -1) return;
  
    const updatedBoards = [...boards];
  
    const taskIndex = updatedBoards[previousBoardIndex].tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      updatedBoards[previousBoardIndex].tasks.splice(taskIndex, 1);
    }
  
    updatedBoards[boardIndex].tasks.push(task);
  
    setBoards(updatedBoards);
  
    const updatedTask = { ...task, boardId: updatedBoards[boardIndex].id };
    console.log("OnDropTask:", task.id, updatedTask); 
    console.log("OnDropTask previous task:", task.id, task);
  
    try {
      await updateTask(task.id, updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
            <Route path="/signup" element={<Signup notification={notification} setNotification={setNotification}/>} />
            <Route path="/login" element={<Login notification={notification} setNotification={setNotification} isMobile={isMobile}/>} />
            <Route path="/" element={<Home boards={boards} setBoards={setBoards} tasks={tasks} setTasks={setTasks} onDropTask={onDropTask} notification={notification} setNotification={setNotification}/>} />
            <Route path="/task-list" element={<TaskList tasks={tasks} setTasks={setTasks} boards={boards} notification={notification} setNotification={setNotification}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
