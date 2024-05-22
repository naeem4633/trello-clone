import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import { useFirebase } from '../context/firebase';

const Board = ({ name, boardId, onDropTask, tasks }) => {
  const { createTask, deleteTask } = useFirebase();
  const [tasksForBoard, setTasksForBoard] = useState(tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  const handleTasksForBoardChange = (updatedTask) => {
    setTasksForBoard(tasksForBoard.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasksForBoard(tasksForBoard.filter(t => t.id !== taskId));
    deleteTask(taskId);
  };

  const handleAddTask = async () => {
    try {
      const createdAt = new Date(); // Get the current date and time
      const taskId = await createTask(boardId, { ...newTask, boardId, createdAt });
      setTasksForBoard([...tasksForBoard, { id: taskId, ...newTask, createdAt }]);
      setNewTask({ title: '', description: '', dueDate: '' }); // Clear the input fields
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

  return (
    <div
      ref={drop}
      className='w-52 border border-black flex flex-col'
      style={{ backgroundColor: isOver ? 'lightgray' : 'white' }}
    >
      <p className='text-center'>{name}</p>
      <div className='flex flex-col border border-black'>
        {tasksForBoard?.map((task) => (
          <Task key={task.id} task={task} onDropTask={onDropTask} handleTasksForBoardChange={handleTasksForBoardChange} handleDeleteTask={handleDeleteTask} />
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

export default Board;
