import React, { useState } from 'react';
import { FaHome, FaShoppingCart, FaUser, FaSignInAlt, FaBox, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cart from './Cart';
import { logout } from '../store/AuthSlice'; 
import LoginModal from './LoginModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const token = useSelector((state) => state.auth.token); 
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  //console.log(totalQuantity,cartItems)
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    document.body.classList.toggle('overflow-hidden', !drawerOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true); 
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem('authData'); 
  };

  const closeModal = () => {
    setIsLoginModalOpen(false); 
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50 shadow-md">
        <div className="text-white text-lg font-semibold">Reacto Shopping</div>
        <div className="flex items-center">
          <div className="text-white text-lg flex items-center mr-6">
            <Link to="/" className="flex items-center hover:text-gray-400">
              <FaHome className="mr-2" />
              Home
            </Link>
          </div>

          {isAdmin ? (
            <>
            <div className="text-white text-lg flex items-center mr-6">
              <Link to="/add-items" className="flex items-center hover:text-gray-400">
                <FaPlusCircle className="mr-2" />
                Add Items
              </Link>
              
            </div>
            <div className="text-white text-lg flex items-center mr-6">
            <Link to="/admin-order" className="flex items-center hover:text-gray-400">
              <FaBox className="mr-2" />
              Orders
            </Link>
          </div>
          </>
          ) : (
            <>
              <div className="text-white text-lg flex items-center mr-6">
                <Link to="/order" className="flex items-center hover:text-gray-400">
                  <FaBox className="mr-2" />
                  Orders
                </Link>
              </div>
              <div className="relative flex items-center cursor-pointer text-white text-lg hover:text-gray-400 mr-6" onClick={toggleDrawer}>
                <FaShoppingCart className="mr-2" />
                <span>Cart</span>
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </>
          )}
          {token ? (
            <div
              className="text-white text-lg cursor-pointer hover:text-gray-400 flex items-center mx-3"
              onClick={handleLogoutClick}
            >
              <FaUser className="mr-2" />
              Profile
            </div>
          ) : (
            <div
              className="text-white text-lg cursor-pointer hover:text-gray-400 flex items-center mx-3"
              onClick={handleLoginClick}
            >
              <FaSignInAlt className="mr-2" />
              Login
            </div>
          )}
        </div>
      </div>
      <div className="mt-16">
        <Cart isOpen={drawerOpen} toggleDrawer={toggleDrawer} cartItems={cartItems} />
      </div>
      {isLoginModalOpen && <LoginModal closeModal={closeModal} />}
    </div>
  );
};

export default Navbar;
