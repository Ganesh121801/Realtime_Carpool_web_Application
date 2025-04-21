import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import Profile from './pages/Profile'  // Update import path
import Services from './pages/Services'
import About from './pages/About'
import Help from './pages/Help'
import CaptainEarnings from './pages/CaptainEarnings';
import CaptainTrips from './pages/CaptainTrips'
import CaptainHelp from './pages/CaptainHelp'
import CaptainProfile from './pages/CaptainProfile';
// import PaymentSuccess from './components/PaymentSuccess'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<Captainlogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
        <Route path='/captain/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          } 
        />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route 
          path="/captain-earnings" 
          element={
            <CaptainProtectWrapper>
              <CaptainEarnings />
            </CaptainProtectWrapper>
          } 
        />
        <Route 
          path="/captain-trips" 
          element={
            <CaptainProtectWrapper>
              <CaptainTrips />
            </CaptainProtectWrapper>
          } 
        />
        <Route 
          path="/captain-help" 
          element={
            <CaptainProtectWrapper>
              <CaptainHelp />
            </CaptainProtectWrapper>
          } 
        />
        <Route 
          path="/captain-profile" 
          element={
            <CaptainProtectWrapper>
              <CaptainProfile />
            </CaptainProtectWrapper>
          } 
        />
        {/* <Route path="/paymentSuccess" element={<PaymentSuccess/>} /> */}
      </Routes>
    </div>
  )
}

export default App