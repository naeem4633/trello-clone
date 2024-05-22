import React from 'react'
import TaskTable  from '../components/TaskTable'
import {Link} from 'react-router-dom'

const TaskList = ({tasks, setTasks, boards}) => {
  return (
    <section className='w-full border border-black h-[100vh] p-1'>
        <div className='w-full h-full border border-black flex flex-col items-center p-1'>
          <div className='w-full h-10 border border-black'>
            <h1 className='text-2xl'>TRELLO CLONE</h1>
          </div>
          <div className='w-full flex-grow flex border border-black'>
            <div className='w-1/5 border border-black'>
              <Link to={'/task-list'} className='w-full p-2 flex justify-start items-center border border-black'>
                <p>TASK LIST</p>
              </Link>
              <Link to={'/'} className='w-full p-2 flex justify-start items-center border border-black'>
                <p>BOARDS</p>
              </Link>
            </div>
            <div className='w-4/5 border border-black flex flex-col'>
              <div className='border border-black text-xl text-center'>
                <p>MY TASKS</p>
              </div>
              <div className='w-full flex-grow border border-black p-8'>
                <TaskTable tasks={tasks} setTasks={setTasks} boards={boards}/>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default TaskList;