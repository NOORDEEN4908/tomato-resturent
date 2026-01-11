import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu")

  const { getTotalCartAmount, cartItems, token, setToken } = useContext(StoreContext);
  
  // Calculate total number of items in cart
  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const navigate =useNavigate()
  
  const logout=()=>{
    localStorage.removeItem("token")
    setToken("");
    navigate("/")


  }



  return (
    <div className='navbar' >
      <Link to={'/'} >    <img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to={'/'} onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mpbile-app")} className={menu === "mpbile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact-us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to={'/cart'} > <img src={assets.basket_icon} alt="" /></Link>
          {getCartItemCount() > 0 && (
            <div className="cart-badge">{getCartItemCount()}</div>
          )}
        </div>
        {!token ? 
  <button onClick={() => {setShowLogin(true)}}>Sign in</button>
  : 
  <div className='navbar-profile' >
    <img src={assets.profile_icon}/>
    <ul className="nav-profile-dropdown">
    <li onClick={() => navigate('/profile')}>
                <img src={assets.profile_icon} alt="" /><p>Profile</p>
              </li>
              <hr />
      <li onClick={()=>navigate('/userorders')} ><img src={assets.bag_icon} alt="Bag Icon" /><p>Orders</p></li>
      <hr />
      <li onClick={logout} ><img src={assets.logout_icon} alt="Logout Icon" /><p>LogOut</p></li>
    </ul>
  </div>
}


      </div>
    </div>
  )
}

export default Navbar