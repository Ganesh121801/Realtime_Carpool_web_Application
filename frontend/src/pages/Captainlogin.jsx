import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data

      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      localStorage.setItem('captainId', response.data.captain._id);
      navigate('/captain-home')

    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navbar */}
      <nav className='bg-white shadow-md py-4 px-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <Link to="/" className="flex items-center gap-2">
                      <i className="ri-group-line text-2xl text-blue-600"></i>
                      <span className="font-bold text-xl">RideShare</span>
                    </Link>
          <div className='hidden md:flex gap-6'>
            <Link to="/captain-signup" className='hover:text-blue-600 transition-colors'>Register</Link>
            <Link to="/about" className='hover:text-blue-600 transition-colors'>About</Link>
            <Link to="/contact" className='hover:text-blue-600 transition-colors'>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='flex-1 flex flex-col justify-between'>
        <div className='max-w-md mx-auto w-full px-5 py-8 md:py-12'>
          <form onSubmit={submitHandler} className='bg-white md:shadow-lg md:rounded-xl md:p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Captain Login</h2>

            <div className='space-y-4 mb-6'>
              <div>
                <h3 className='text-lg font-medium mb-2'>Email</h3>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-[#eeeeee] rounded-lg px-4 py-3 border w-full text-lg 
                  placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="email"
                  placeholder='email@example.com'
                />
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2'>Password</h3>
                <input
                  className='bg-[#eeeeee] rounded-lg px-4 py-3 border w-full text-lg 
                  placeholder:text-base hover:bg-gray-100 transition-colors'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  placeholder='password'
                />
              </div>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg 
              hover:bg-gray-800 transition-colors duration-200'
            >Login</button>

            <p className='text-center text-gray-600'>
              New to CarPool? 
              <Link to='/captain-signup' className='text-blue-600 hover:text-blue-700 ml-1'>
                Register as a Captain
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className='px-5 py-4'>
          <div className='max-w-md mx-auto'>
            <Link
              to='/login'
              className='bg-[#d5622d] flex items-center justify-center text-white font-semibold 
              rounded-lg px-4 py-3 w-full text-lg hover:bg-[#c55a2a] transition-colors duration-200'
            >Sign in as User</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin