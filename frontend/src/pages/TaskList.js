import React, { useState, useEffect } from 'react';
import TaskTable  from '../components/TaskTable'
import {Link} from 'react-router-dom'
import Spinner from '../components/Spinner';

const TaskList = ({tasks, setTasks, boards}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
    setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
}, []);

  return (
    <section className='w-full h-[100vh] p-1'>
        <div className='w-full h-full flex flex-col items-center p-1'>
          <div className='w-full h-10 text-2xl text-left border-b border-gray-300'>
            <h1>TRELLO CLONE</h1>
          </div>
          <div className='w-full flex flex-col md:flex-row'>
            <div className='w-1/5 md:w-64 border-r border-gray-300'>
              <Link to={'/task-list'} className='w-full p-2 flex justify-start items-center border-b border-gray-300 hover:bg-gray-200 transition-all duration-150'>
                <p>TASK LIST</p>
              </Link>
              <Link to={'/'} className='w-full p-2 flex justify-start items-center border-b border-gray-300 hover:bg-gray-200 transition-all duration-150'>
                <p>BOARDS</p>
              </Link>
            </div>
            <div className='w-4/5 md:w-5/6 border-l border-gray-300 flex flex-col'>
              <div className='w-full text-xl text-center border-b border-gray-300 p-2'>
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