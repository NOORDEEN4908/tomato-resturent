import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import ProfileSetup from './pages/Profile/Profile'; // Make sure this is the correct path
import { StoreContext } from './context/StoreContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const {showProfileSetup} = useContext(StoreContext);

  return (
    <>
      {/* Login Popup */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Profile Setup Overlay */}
      {showProfileSetup && <ProfileSetup />}

      <div className='app'>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/userorders' element={<MyOrders />} />
          <Route path='/profile' element={<ProfileSetup />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
