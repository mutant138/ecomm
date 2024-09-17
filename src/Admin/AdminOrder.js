/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // To track the expanded order

  const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL;

  // Fetching the orders from the db
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${DATABASE_URL}/orders.json`);
      const fetchedOrders = response.data
        ? Object.keys(response.data).map((id) => ({ id, ...response.data[id] }))
        : [];
      setOrders(fetchedOrders);
    } catch (error) {
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${DATABASE_URL}/orders/${orderId}.json`, {
        status: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId); 
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Orders</h1>
      <hr className="border-t-2 border-gray-300 my-4" />

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 shadow-lg bg-white"
            >
              <h2 className="text-xl mb-2">
                Order ID: <span className="font-semibold">{order.id}</span>
              </h2>
              <p className="text-gray-600">Total Price: ₹{order.totalPrice}</p>
              <p className="text-gray-600">
                Created At: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="mt-4">
                <label
                  htmlFor={`status-${order.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Change Status:
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => toggleOrderDetails(order.id)}
              >
                {expandedOrderId === order.id ? "Hide Order Details" : "View Order Details"}
              </button>

              {expandedOrderId === order.id && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                  <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left">
                          Item Name
                        </th>
                        <th className="py-2 px-4 border-b text-left">Price</th>
                        <th className="py-2 px-4 border-b text-left">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="py-2 px-4 border-b">{item.name}</td>
                          <td className="py-2 px-4 border-b">₹{item.price}</td>
                          <td className="py-2 px-4 border-b">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "shipped":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default AdminOrder;
