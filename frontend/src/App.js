import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useFirebase } from './context/firebase';
import ErrorPage from './pages/ErrorPage';
import TaskList from './pages/TaskList';

function App() {
  // const [user, setUser] = useState(null);
  const firebase = useFirebase();
  const {createBoard, createTask, getAllBoards, getAllTasks, updateTask } = useFirebase();
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  
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
  
    // Update the task with the new board ID
    const updatedTask = { ...task, boardId: updatedBoards[boardIndex].id };
    console.log("OnDropTask:", task.id, updatedTask); 
    console.log("OnDropTask previous task:", task.id, task);
  
    try {
      await updateTask(task.id, updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error here, such as displaying a notification to the user
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home boards={boards} setBoards={setBoards} tasks={tasks} setTasks={setTasks} onDropTask={onDropTask}/>} />
            <Route path="/task-list" element={<TaskList tasks={tasks} setTasks={setTasks} boards={boards}/>} />
            <Route path="*" element={<ErrorPage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
