import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useFirebase } from '../context/firebase';

const Task = ({ task, onDropTask, handleTasksForBoardChange, handleDeleteTask }) => {
  const {updateTask} = useFirebase();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging:!!monitor.isDragging(),
    }),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({...task });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTask({...task });
  };

  const handleSaveEdit = () => {
    handleTasksForBoardChange(editedTask)
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({...editedTask, [name]: value });
  };

  const handleDeleteTaskClick = () => {
    handleDeleteTask(task.id);
  };

  return (
    <div ref={drag} className='border border-black hover:cursor-pointer' style={{ opacity: isDragging? 0.5 : 1 }}>
      {isEditing? (
        <div>
          <input type="text" name="title" value={editedTask.title} onChange={handleInputChange} />
          <input type="text" name="description" value={editedTask.description} onChange={handleInputChange} />
          <input type="date" name="dueDate" value={editedTask.dueDate} onChange={handleInputChange} />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <div className='overflow-hidden'>
          <p>{task.title}</p>
          <p className=''>{task.description}</p>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDeleteTaskClick}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Task;