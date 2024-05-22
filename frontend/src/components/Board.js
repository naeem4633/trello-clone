import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';

const Board = ({ name, boardId, onDropTask }) => {
  const [tasksForBoard, setTasksForBoard] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/board/${boardId}`);
        const data = await response.json();
        setTasksForBoard(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [boardId]);

  useEffect(() => {
    console.log('Tasks for board:', tasksForBoard);
  }, [tasksForBoard]);

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
          <Task key={task._id} id={task._id} title={task.title} />
        ))}
      </div>
    </div>
  );
};

export default Board;
