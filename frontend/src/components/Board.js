import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { useFirebase } from '../context/firebase';
import DeleteIcon from '@mui/icons-material/Delete';

const Board = ({ name, boardId, onDropTask, tasks, setBoards}) => {
  const { createTask, deleteTask, deleteBoard } = useFirebase();
  const [tasksForBoard, setTasksForBoard] = useState(tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleTasksForBoardChange = (updatedTask) => {
    setTasksForBoard(tasksForBoard.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasksForBoard(tasksForBoard.filter(t => t.id !== taskId));
    deleteTask(taskId);
  };

  const handleAddTask = async () => {
    try {
      const createdAt = new Date();
      const taskId = await createTask(boardId, { ...newTask, boardId, createdAt });
      setTasksForBoard([...tasksForBoard, { id: taskId, ...newTask, createdAt }]);
      setNewTask({ title: '', description: '', dueDate: '' });
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onDropTask(item, name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(boardId);
      setTasksForBoard([]);
      setBoards(prevBoards => prevBoards.filter(b => b.id !== boardId)); 
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <div
      ref={drop}
      className={`w-72 p-4 m-2 bg-white rounded-lg shadow-md border border-gray-300 transition-colors ${isOver ? 'bg-gray-100' : ''}`}
    >
      <div className="text-center font-bold mb-4">
        {name}
        <DeleteIcon onClick={handleDeleteBoard} className="float-right cursor-pointer" />
      </div>
      <div className="flex flex-col gap-2 border border-gray-200 p-2 rounded-lg max-h-96 overflow-y-auto">
        {tasksForBoard?.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDropTask={onDropTask}
            handleTasksForBoardChange={handleTasksForBoardChange}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="flex items-center justify-center w-full p-2 text-black border border-gray-800 rounded hover:bg-black hover:text-white transition-all duration-200"
        >
          {isAddingTask ? 'Cancel' : 'Add New Task'}
        </button>
        {isAddingTask && (
          <div className="mt-2 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddTask}
              className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;