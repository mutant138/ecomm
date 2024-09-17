/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem('authData'))?.userId;

  const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL;
  const fetchOrders = async () => {
    if (!userId) {
      setError('User ID not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${DATABASE_URL}/orders.json`);
      const fetchedOrders = response.data
        ? Object.keys(response.data).map(key => ({
            id: key,
            ...response.data[key],
          })).filter(order => order.userId === userId)
        : [];
      setOrders(fetchedOrders);
    } catch (error) {
      setError('Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); 
  }, [userId]);

  // same like admin order function
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full">Delivered</span>;
      case 'shipped':
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full">Shipped</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full">Pending</span>;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <hr className="border-t-2 border-gray-300 my-4" />
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
                <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <p className="text-gray-700">Total Price: ₹{order.totalPrice}</p>
              <p className="text-gray-700">Status: {order.status}</p>
            </div>

            <h3 className="text-lg font-semibold mb-2">Items in this Order</h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b text-left">{item.name}</td>
                    <td className="py-2 px-4 border-b text-left">₹{item.price}</td>
                    <td className="py-2 px-4 border-b text-left">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrder;
