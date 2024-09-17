import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart , removeFromCart} from '../store/CartSlice';
import { toast } from 'react-toastify';
import Modal from '../Main/Modal';
import axios from 'axios';

const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL; 

const Cart = ({ isOpen, toggleDrawer }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const cartRef = useRef(null);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const gst = (totalPrice * 0.18).toFixed(2);
  const platformFee = (totalPrice * 0.05).toFixed(2);
  const discount = (totalPrice * 0.23).toFixed(2); 
  const deliveryFee = 20.00;
  const finalTotal = (parseFloat(totalPrice) + parseFloat(gst) + parseFloat(platformFee) + deliveryFee - parseFloat(discount)).toFixed(2);

  const handleClearCart = () => {
    toast.success('Successfully cleared all cart items!');
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!token) {
      toast.error('Please log in to proceed with the checkout.');
      return;
    }
    setIsCheckoutOpen(true);
  };
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart!');
  };
 const handleOrderPlace = async () => {
  if (!token) {
    toast.error('Please log in to proceed with the checkout.');
    return;
  }

  try {
    const userData = JSON.parse(localStorage.getItem('authData'));
    const userId = userData?.userId || null;
  //console.log(userId);
    const newOrder = {
      userId: userId,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: finalTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const response = await axios.post(`${DATABASE_URL}/orders.json`, newOrder);
    const orderId = response.data.name; 
    //console.log(orderId);
    await axios.patch(`${DATABASE_URL}/orders/${orderId}.json`, { orderId });
    toast.success('Order placed successfully!');
    dispatch(clearCart());
    setIsCheckoutOpen(false);
  } catch (error) {
    console.error("Error placing order:", error);
    toast.error('Failed to place the order. Please try again.');
  }
  
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        toggleDrawer();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleDrawer]);

  return (
    <div
      ref={cartRef}
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="flex justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={toggleDrawer} aria-label="Close Cart" className="text-xl">&times;</button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="mb-4 flex items-center">
              <img src={item.url} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="ml-auto bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Your cart is empty</p>
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between mb-4">
            <p className="font-semibold">Total:</p>
            <p className="font-semibold">₹{totalPrice}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          >
            Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mt-2 hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      )}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          {cartItems.length > 0 ? (
            <div>
              {cartItems.map((item, index) => (
                <div key={index} className="mb-2 flex justify-between">
                  <p className="font-semibold">{item.name}</p>
                  <p>₹{item.price} x {item.quantity}</p>
                </div>
              ))}
              <div className="flex justify-between mb-2 border-t border-gray-200 pt-2">
                <p className="font-semibold">Subtotal:</p>
                <p>₹{totalPrice}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Discount:</p>
                <p className="font-thin">(First Time User :)</p>
                <p>₹{discount}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="font-semibold">GST (18%):</p>
                <p>₹{gst}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Platform Fee (5%):</p>
                <p>₹{platformFee}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="font-semibold">Delivery Fee:</p>
                <p>₹{deliveryFee}</p>
              </div>
              <div className="flex justify-between mb-4 border-t border-gray-200 pt-2">
                <p className="font-semibold">Total:</p>
                <p className="font-semibold">₹{finalTotal}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Your cart is empty</p>
          )}
        </div>
        <button
          onClick={handleOrderPlace}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-600"
        >
          Place Order
        </button>
      </Modal>
    </div>
  );
};

export default Cart;
