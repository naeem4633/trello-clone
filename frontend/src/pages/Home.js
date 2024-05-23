import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Board from '../components/Board';
import Spinner from '../components/Spinner';
import { useFirebase } from '../context/firebase';

const Home = ({ boards, onDropTask, setBoards, notification, setNotification }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const { getAuth, createBoard } = useFirebase();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddBoard = async () => {
    if (!newBoardName.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const newBoardId = await createBoard(newBoardName);
      setBoards((prevBoards) => [...prevBoards, { id: newBoardId, name: newBoardName, tasks: [] }]);
      setNewBoardName('');
    } catch (error) {
      console.error("Error creating board:", error);
      setNotification({ message: error.message, visible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
        await getAuth().signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

  return (
    <>
    {notification.visible && (
        <div className="border border-gray-200 w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 text-sm transition-all duration-500 custom-shadow-1">
          <p>{notification.message}</p>
        </div>
      )}
      <section className='w-full h-[100vh] px-1'>
        <div className='w-full h-full flex flex-col items-center'>
          <div className='w-full text-2xl text-left border-b border-gray-300 flex justify-between px-2 py-2'>
            <h1 className='font-bold'>TRELLO CLONE</h1>
            <button className='p-2 text-black border border-gray-800 rounded hover:bg-black hover:text-white transition-all duration-200 text-sm' onClick={handleLogoutClick}>LOGOUT</button>
          </div>
          <div className='w-full flex flex-col md:flex-row'>
            <div className='w-1/5 md:w-64 border-r border-gray-300'>
              <Link to={'/task-list'} className='w-full p-2 flex justify-start items-center border-b border-gray-300 hover:bg-gray-200 transition-all duration-150'>
                <p>TASK LIST</p>
              </Link>
              <Link to={'/'} className='w-full p-2 flex justify-start items-center border-b border-gray-300 hover:bg-gray-200 transition-all duration-300'>
                <p>BOARDS</p>
              </Link>
            </div>
            <div className='w-4/5 md:w-5/6 border-l border-gray-300 flex flex-col'>
              <div className='w-full text-xl text-center border-b border-gray-300 p-2'>
                <p>MY BOARDS</p>
              </div>
              {isLoading && boards.length === 0 && (<Spinner/>)}
              <div className='mx-auto w-1/2 flex flex-row justify-between items-center space-x-10 py-5'>
                <div className='flex-grow'>
                  <input
                    type='text'
                    placeholder='Enter board name'
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md'
                  />
                </div>
                <button
                  onClick={handleAddBoard}
                  disabled={isLoading}
                  className='w-40 p-2 text-black border border-gray-800 rounded hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50'
                >
                  Add Board
                </button>
              </div>
              <div className='w-full flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
              {boards.map((board, index) => (
                  <Board key={index} boardId={board.id} name={board.name} onDropTask={onDropTask} tasks={board.tasks} setBoards={setBoards} notification={notification} setNotification={setNotification}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;