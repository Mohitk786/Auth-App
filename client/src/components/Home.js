import React from 'react'
import { useNavigate } from 'react-router'

export const Home = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen flex items-center justify-center gap-8'>
        <button onClick={() => navigate('/signUp')} className=' bg-slate-500 rounded-md hover:bg-green-300 hover:text-black p-2 hover:font-bold'>signUp</button>
        <button onClick={() => navigate('/login')} className=' bg-slate-500 rounded-md hover:bg-green-300 hover:text-black p-2 hover:font-bold'>Login</button>
    </div>
  )
}
