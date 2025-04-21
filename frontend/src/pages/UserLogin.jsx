import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ userData, setUserData ] = useState({})

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', response.data.user._id);
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
                        <i className="ri-group-line text-2xl text-blue-600"></i>
                        <span className="font-bold text-xl">RideShare</span>
                      </Link>
            <div className="flex items-center space-x-4">
              <Link to="/signup" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Sign Up</Link>
              <Link to="/captain-login" className="bg-[#10b461] text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-[#0d9351] text-sm sm:text-base">
                Drive with us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mt-16">
        <div className="max-w-lg mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Welcome Back</h2>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Email Input */}
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Email address</h3>
                <input
                  required
                  className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#10b461] focus:ring-1 focus:ring-[#10b461] transition-colors text-base"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Password</h3>
                <input
                  required
                  className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#10b461] focus:ring-1 focus:ring-[#10b461] transition-colors text-base"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#111] hover:bg-[#222] text-white font-semibold rounded-lg px-4 py-3 text-base sm:text-lg transition-colors duration-200"
              >
                Login
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <p className="text-center text-gray-600">
                New here?{' '}
                <Link to="/signup" className="text-[#10b461] hover:text-[#0d9351] font-medium">
                  Create new Account
                </Link>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Link
                to="/captain-login"
                className="w-full flex items-center justify-center bg-[#10b461] hover:bg-[#0d9351] text-white font-semibold rounded-lg px-4 py-3 text-base sm:text-lg transition-colors duration-200"
              >
                Sign in as Captain
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserLogin