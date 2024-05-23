import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { useFirebase } from '../context/firebase';
import DeleteIcon from '@mui/icons-material/Delete';

const Board = ({ name, boardId, onDropTask, tasks, setBoards,  notification, setNotification}) => {
  const { createTask, deleteTask, deleteBoard } = useFirebase();
  const [tasksForBoard, setTasksForBoard] = useState(tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleTasksForBoardChange = (updatedTask) => {
    setTasksForBoard(tasksForBoard.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasksForBoard(tasksForBoard.filter(t => t.id !== taskId));
    setNotification({ message: "Task Deleted", visible: true });
    deleteTask(taskId);
  };

  const handleAddTask = async () => {
    try {
      const createdAt = new Date();
      setNotification({ message: "Adding Task...", visible: true });
      const taskId = await createTask(boardId, { ...newTask, boardId, createdAt });
      setTasksForBoard([...tasksForBoard, { id: taskId, ...newTask, createdAt }]);
      setNewTask({ title: '', description: '', dueDate: '' });
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error creating task:", error);
      setNotification({ message: error.message, visible: true });
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
      setNotification({ message: "Deleting board...", visible: true });
      await deleteBoard(boardId);
      setTasksForBoard([]);
      setBoards(prevBoards => prevBoards.filter(b => b.id !== boardId)); 
    } catch (error) {
      console.error("Error deleting board:", error);
      setNotification({ message: error.message, visible: true });
    }
  };

  return (
    <>
    {notification.visible && (
        <div className="border border-gray-200 w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 text-sm transition-all duration-500 text-black">
          <p>{notification.message}</p>
        </div>
      )}
    <div
      ref={drop}
      className={`p-4 min-h-72 max-h-96 overflow-y-hidden bg-[#f1f2f4] rounded-lg transition-colors text-gray-600 ${isOver ? 'bg-gray-100' : ''}`}
    >
      <div className="text-left font-semibold text-sm mb-4">
        {name}
        <DeleteIcon fontSize="small" onClick={handleDeleteBoard} className="float-right cursor-pointer" />
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
      <div className="mt-4 font-semibold text-sm">
        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="flex items-center justify-start w-full p-2 rounded hover:bg-gray-300 transition-all duration-200 text-left"
        >
          {isAddingTask ? 'Cancel' : 'Add a Task'}
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
              className="w-full p-2 text-gray-600 text-center hover:bg-gray-300 rounded transition-all duration-200"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Board;