import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Board from '../components/Board';
import Spinner from '../components/Spinner';
import { useFirebase } from '../context/firebase';
import LogoutIcon from '@mui/icons-material/Logout';

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
        <div className="border border-gray-200 w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 text-sm transition-all duration-500 text-black">
          <p>{notification.message}</p>
        </div>
      )}
      <section className='w-full h-[100vh] bg-[#cd5a91] text-white'>
        <div className='w-full h-full flex flex-col items-center'>
          <div className='w-full text-2xl text-left flex justify-between'>
            <h1 className='font-bold p-2'>TRELLO CLONE</h1>
            <div onClick={handleLogoutClick} className='flex items-center justify-center hover:cursor-pointer px-2 hover:bg-[#9c446e]'>
              <LogoutIcon/>
            </div>
          </div>
          <div className='w-full flex flex-row h-screen'>
            <div className='w-1/5 h-full bg-[#ac4c7a] text-sm font-semibold'>
              <Link to={'/task-list'} className='w-full p-4 flex justify-start items-center hover:bg-[#c582a2] transition-all duration-150'>
                <p>TASK LIST</p>
              </Link>
              <Link to={'/'} className='w-full p-4 flex justify-start items-center hover:bg-[#c582a2] transition-all duration-300'>
                <p>MY BOARDS</p>
              </Link>
            </div>
            <div className='w-5/6 flex flex-col'>
              <div className='w-full font-semibold text-left p-4 bg-[#9c446e]'>
                <p>MY BOARDS</p>
              </div>
              {isLoading && boards.length === 0 && (<Spinner/>)}
              <div className='w-full flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4'>
              {boards.map((board, index) => (
                  <Board key={index} boardId={board.id} name={board.name} onDropTask={onDropTask} tasks={board.tasks} setBoards={setBoards} notification={notification} setNotification={setNotification}/>
                ))}
              </div>
              <div className='mx-auto w-1/2 flex flex-row justify-between items-center space-x-4 py-6 text-sm text-black'>
                <div className='flex-grow'>
                  <input
                    type='text'
                    placeholder='Enter board name'
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className='w-full p-2 px-4 rounded-md text-white placeholder:text-white focus:outline-gray-400 bg-[#ac4c7a]'
                  />
                </div>
                <button
                  onClick={handleAddBoard}
                  disabled={isLoading}
                  className='w-32 p-2 text-white font-semibold hover:bg-[#9c446e] rounded  transition-all duration-200 disabled:opacity-50'
                >
                  Add Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;