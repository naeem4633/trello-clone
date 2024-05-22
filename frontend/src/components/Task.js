import React from 'react';
import { useDrag } from 'react-dnd';

const Task = ({ title, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id, title },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className='border border-black hover:cursor-pointer'
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <p>{title}</p>
    </div>
  );
};

export default Task;
