import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/CartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const ShoppingList = () => {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adminItems, setAdminItems] = useState([]);  // State to hold admin-added items
  const [selectedCategory, setSelectedCategory] = useState('all');  // State to track selected category
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL; // Firebase URL

  // Fetch items added by admin from Firebase
  const fetchAdminItems = async () => {
    try {
      const response = await axios.get(`${DATABASE_URL}/items.json`);
      const fetchedItems = response.data ? Object.values(response.data) : [];
      setAdminItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching admin items:", error);
    }
  };

  useEffect(() => {
    fetchAdminItems(); 
    // eslint-disable-next-line
  },[]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const handleAddToCart = (item) => {
    setSelectedItem(item);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10) || 1);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      dispatch(addToCart({ ...selectedItem, quantity }));
      toast.success(`${selectedItem.name} added to cart!`); 
      handleClose();
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? adminItems
    : adminItems.filter(item => item.category === selectedCategory);

  return (
    
  <div className="relative">
  <div className="mb-6 flex justify-start">
    <select
      onChange={(e) => setSelectedCategory(e.target.value)}
      value={selectedCategory}
      className="border border-gray-300 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
    >
      <option value="all">All</option>
      <option value="tea">Tea</option>
      <option value="oil">Oil</option>
    </select>
  </div>

  {/* Conditional Heading */}
  {selectedCategory === 'oil' && (
    <h2 className="text-3xl font-bold text-gray-800 my-8 text-start">
      Explore Our Premium Oil Collection
    </h2>
  )}
  {selectedCategory === 'tea' && (
    <h2 className="text-3xl font-bold text-gray-800 my-8 text-start">
      Explore Our Premium Tea Collection
    </h2>
  )}
  {selectedCategory === 'all' && (
    <h2 className="text-3xl font-bold text-gray-800 my-8 text-start">
      Explore Our Premium Oil and Tea Collection
    </h2>
  )}

      <div className="flex justify-center items-center relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto py-4 px-4 space-x-6 scrollbar-hide w-full"
        >
          {filteredItems.length === 0 ? (
            <p>No items available</p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-60 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={item.url}
                  alt={`Product ${item.id}`}
                  className="w-full h-36 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                />
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xl font-semibold text-gray-800">
                      ₹ {item.price}
                    </p>
                    <p className="text-sm text-gray-600">{item.quantity}</p>
                  </div>
                  {isAdmin ? (
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                      disabled
                    >
                      No access for Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {!isAtStart && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 z-10"
          >
            <FaChevronLeft size={10} />
          </button>
        )}
        {!isAtEnd && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 z-10"
          >
            <FaChevronRight size={10} />
          </button>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Add {selectedItem.name} to Cart</h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-semibold text-gray-800">₹{selectedItem.price}</p>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2"
            >
              Close
            </button>
            <button
              onClick={handleConfirm}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
