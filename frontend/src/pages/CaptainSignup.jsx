import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')


  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }
z
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')

  }
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navbar */}
      <nav className='bg-white shadow-md py-4 px-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <Link to="/" className='flex items-center gap-2'>
            <img className='w-12 h-12' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="logo" />
            <span className='text-xl font-bold'>CarPool</span>
          </Link>
          <div className='hidden md:flex gap-6'>
            <Link to="/captain-login" className='hover:text-blue-600 transition-colors'>Login</Link>
            <Link to="/about" className='hover:text-blue-600 transition-colors'>About</Link>
            <Link to="/contact" className='hover:text-blue-600 transition-colors'>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='flex-1 flex flex-col justify-between'>
        <div className='max-w-2xl mx-auto w-full px-5 py-8 md:py-12'>
          <form onSubmit={submitHandler} className='bg-white md:shadow-lg md:rounded-xl md:p-8'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Captain Registration</h2>
            
            {/* Name Fields */}
            <div className='space-y-4 mb-6'>
              <h3 className='text-lg font-medium'>Personal Information</h3>
              <div className='flex flex-col md:flex-row gap-4'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                />
                <input
                  required
                  className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                  }}
                />
              </div>
            </div>

            {/* Email and Password Fields */}
            <div className='space-y-4 mb-6'>
              <h3 className='text-lg font-medium'>What's our Captain's email</h3>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                type="email"
                placeholder='email@example.com'
              />

              <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

              <input
                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required type="password"
                placeholder='password'
              />
            </div>

            {/* Vehicle Information */}
            <div className='space-y-4 mb-6'>
              <h3 className='text-lg font-medium'>Vehicle Information</h3>
              <div className='flex gap-4 mb-7'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="text"
                  placeholder='Vehicle Color'
                  value={vehicleColor}
                  onChange={(e) => {
                    setVehicleColor(e.target.value)
                  }}
                />
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="text"
                  placeholder='Vehicle Plate'
                  value={vehiclePlate}
                  onChange={(e) => {
                    setVehiclePlate(e.target.value)
                  }}
                />
              </div>
              <div className='flex gap-4 mb-7'>
                <input
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  type="number"
                  placeholder='Vehicle Capacity'
                  value={vehicleCapacity}
                  onChange={(e) => {
                    setVehicleCapacity(e.target.value)
                  }}
                />
                <select
                  required
                  className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base hover:bg-gray-100 transition-colors'
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value)
                  }}
                >
                  <option value="" disabled>Select Vehicle Type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-3 w-full text-lg 
              hover:bg-gray-800 transition-colors duration-200'
            >Create Captain Account</button>

            <p className='text-center text-gray-600'>
              Already have an account? 
              <Link to='/captain-login' className='text-blue-600 hover:text-blue-700 ml-1'>
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className='px-5 py-4 bg-gray-50'>
          <div className='max-w-2xl mx-auto'>
            <p className='text-[11px] text-gray-500'>
              This site is protected by reCAPTCHA and the 
              <span className='underline cursor-pointer ml-1'>Google Privacy Policy</span> and 
              <span className='underline cursor-pointer ml-1'>Terms of Service apply</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup