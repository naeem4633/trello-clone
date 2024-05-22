import React from 'react';
import Header from '../components/Header';
import Board from '../components/Board'; 

const Home = ({ boards, onDropTask, tasks }) => {
  return (
    <>
      <section className='w-full border border-black h-[100vh] p-1'>
        <div className='w-full h-full border border-black flex flex-col items-center p-1'>
          <div className='w-full h-10 border border-black'>
            <h1 className='text-2xl'>TRELLO CLONE</h1>
          </div>
          <div className='w-full flex-grow flex border border-black'>
            <div className='w-1/5 border border-black'></div>
            <div className='w-4/5 border border-black flex flex-col'>
              <div className='border border-black text-xl text-center'>
                <p>MY BOARDS</p>
              </div>
              <div className='w-full flex-grow flex space-x-20 items-start border border-black p-8'>
                {boards.map((board, index) => (
                  <Board key={index} boardId={board._id} name={board.name} onDropTask={onDropTask} />
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
