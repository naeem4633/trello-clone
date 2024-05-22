import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useFirebase } from '../context/firebase';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Task = ({ task, onDropTask, handleTasksForBoardChange, handleDeleteTask }) => {
  const { updateTask } = useFirebase();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };

  const handleSaveEdit = () => {
    handleTasksForBoardChange(editedTask);
    updateTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleDeleteTaskClick = () => {
    handleDeleteTask(task.id);
  };

  return (
    <div
      ref={drag}
      className={`p-4 mb-2 bg-white rounded-lg shadow-md border border-gray-300 ${isDragging ? 'opacity-50' : 'opacity-100'} transition-opacity`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Title"
          />
          <input
            type="text"
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
            placeholder="Description"
          />
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
          <div className="flex justify-between">
            <button
              onClick={handleSaveEdit}
              className="flex items-center px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              <SaveIcon fontSize="small" />
              <span className="ml-1">Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              <CancelIcon fontSize="small" />
              <span className="ml-1">Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-semibold">{task.title}</p>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex justify-between">
            <button
              onClick={handleEditClick}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <EditIcon fontSize="small" />
              <span className="ml-1">Edit</span>
            </button>
            <button
              onClick={handleDeleteTaskClick}
              className="flex items-center text-red-500 hover:text-red-600"
            >
              <DeleteIcon fontSize="small" />
              <span className="ml-1">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
