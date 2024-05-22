import React, { useState } from 'react';
import { useFirebase } from '../context/firebase';
import { Add as AddIcon } from '@mui/icons-material';

const NewBoardPlaceholder = ({ onCreateBoard }) => {
  const [newBoardName, setNewBoardName] = useState('');
  const handleCreateBoard = async () => {
    try {
      if (!newBoardName.trim()) return; // Don't create board if name is empty or whitespace
      await onCreateBoard(newBoardName);
      setNewBoardName(''); // Clear input field after creating board
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="w-72 p-4 m-2 bg-gray-100 rounded-lg shadow-md border border-gray-300">
      <div className="text-center font-bold mb-4">Create New Board</div>
      <div className="flex items-center justify-center mt-4">
        <input
          type="text"
          placeholder="New Board Name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleCreateBoard}
          className="ml-2 p-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          <AddIcon />
        </button>
      </div>
    </div>
  );
};

export default NewBoardPlaceholder;
