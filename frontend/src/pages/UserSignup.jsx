import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
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
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">Login</Link>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Create Account</h2>

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">What's your name?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#10b461] focus:ring-1 focus:ring-[#10b461] transition-colors text-base"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    required
                    className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#10b461] focus:ring-1 focus:ring-[#10b461] transition-colors text-base"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

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

              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Password</h3>
                <input
                  required
                  className="w-full bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#10b461] focus:ring-1 focus:ring-[#10b461] transition-colors text-base"
                  type="password"
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#111] hover:bg-[#222] text-white font-semibold rounded-lg px-4 py-3 text-base sm:text-lg transition-colors duration-200"
              >
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account? {' '}
              <Link to="/login" className="text-[#10b461] hover:text-[#0d9351] font-medium">
                Login here
              </Link>
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center mt-8">
            This site is protected by reCAPTCHA and the{' '}
            <span className="underline cursor-pointer">Google Privacy Policy</span> and{' '}
            <span className="underline cursor-pointer">Terms of Service</span> apply.
          </p>
        </div>
      </main>
    </div>
  )
}

export default UserSignup