import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ListAddedItems = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({});
  const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL;

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${DATABASE_URL}/items.json`);
      const fetchedItems = response.data ? Object.entries(response.data).map(([id, item]) => ({ id, ...item })) : [];
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DATABASE_URL}/items/${id}.json`);
      setItems(items.filter((item) => item.id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${DATABASE_URL}/items/${id}.json`, updatedItem);
      setEditingItem(null);
      fetchItems(); 
      toast.success('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setUpdatedItem(item); 
  };

  useEffect(() => {
    fetchItems(); 
  },);

  return (
    <div className="p-0">
      <h2 className="text-2xl font-normal mb-1">List of Added Items</h2>
      <hr className="border-t-2 border-gray-300 my-3" />
      {items.length === 0 ? (
        <p>No items available</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-4 rounded-md flex justify-between items-center">
              {editingItem === item.id ? (
                <div className="flex-grow">
                  <input
                    type="text"
                    name="name"
                    value={updatedItem.name || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-full mb-2"
                    placeholder="Item Name"
                  />
                  <input
                    type="text"
                    name="url"
                    value={updatedItem.url || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-full mb-2"
                    placeholder="Image URL"
                  />
                  <input
                    type="number"
                    name="price"
                    value={updatedItem.price || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-full mb-2"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="quantity"
                    value={updatedItem.quantity || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-full mb-2"
                    placeholder="Quantity"
                  />
                  <textarea
                    name="description"
                    value={updatedItem.description || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-full mb-2"
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>{item.description}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {editingItem === item.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                    Update
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListAddedItems;
