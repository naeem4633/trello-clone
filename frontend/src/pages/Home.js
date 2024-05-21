import React from 'react'
import Header from '../components/Header'

const Home = () => {
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
                    <div className='w-full flex-grow flex items-start border border-black p-8'>
                        <div className='w-52 border border-black flex flex-col'>
                            <p className='text-center'>Board 1</p>
                            <div className='flex flex-col border border-black'>
                                <div className=''>
                                    <p>TASK 1</p>
                                </div>
                                <div className=''>
                                    <p>TASK 2</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-52 border border-black flex flex-col'>
                            <p className='text-center'>Board 2</p>
                            <div className='flex flex-col border border-black'>
                                <div className=''>
                                    <p>TASK 1</p>
                                </div>
                                <div className=''>
                                    <p>TASK 2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Home