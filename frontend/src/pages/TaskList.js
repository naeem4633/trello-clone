import React, { useState, useEffect } from 'react';
import TaskTable  from '../components/TaskTable'
import {Link} from 'react-router-dom'
import Spinner from '../components/Spinner';
import { useFirebase } from '../context/firebase';
import LogoutIcon from '@mui/icons-material/Logout';

const TaskList = ({tasks, setTasks, boards}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getAuth } = useFirebase();

  useEffect(() => {
    const timer = setTimeout(() => {
    setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogoutClick = async () => {
    try {
        await getAuth().signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error('Error logging out:', error);
    }
  };

  return (    
    <section className='w-full h-[100vh] bg-[#cd5a91] text-white'>
        <div className='w-full h-full flex flex-col items-center'>
          <div className='w-full text-2xl text-left flex justify-between'>
            <h1 className='font-bold p-2'>TRELLO CLONE</h1>
            <div onClick={handleLogoutClick} className='flex items-center justify-center px-2 hover:cursor-pointer hover:bg-[#9c446e]'>
              <LogoutIcon/>
            </div>
          </div>
          <div className='w-full flex flex-col md:flex-row h-screen'>
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
                <p>MY TASKS</p>
              </div>
              {isLoading && boards.length === 0 && (<Spinner/>)}
              <div className='w-full flex-grow p-4'>
                <TaskTable tasks={tasks} setTasks={setTasks} boards={boards}/>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default TaskList;