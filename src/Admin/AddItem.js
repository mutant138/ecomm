import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ListAddedItems from './ListAddedItems';

const AddItem = () => {
  const nameRef = useRef();
  const urlRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL;

    const newItem = {
      name: nameRef.current.value,
      url: urlRef.current.value,
      price: parseFloat(priceRef.current.value),
      quantity: quantityRef.current.value,
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
    };

    try {
      await axios.post(`${DATABASE_URL}/items.json`, newItem);
      toast.success('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item.');
    }

    nameRef.current.value = '';
    urlRef.current.value = '';
    priceRef.current.value = '';
    quantityRef.current.value = '';
    descriptionRef.current.value = '';
  };

  return (
    <div className="flex h-screen">
  <div className="w-1/2 p-4 bg-white shadow-lg rounded-lg overflow-y-auto">
    <h2 className="text-xl font-semibold mb-4 text-left">Add New Item</h2>
    <hr className="border-t-2 border-gray-300 my-4" />
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input
          type="text"
          id="name"
          ref={nameRef}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="url" className="text-sm font-medium">Image URL</label>
        <input
          type="text"
          id="url"
          ref={urlRef}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="price" className="text-sm font-medium">Price</label>
        <input
          type="number"
          id="price"
          ref={priceRef}
          min={0}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
        <input
          type="text"
          id="quantity"
          ref={quantityRef}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          ref={descriptionRef}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select
          id="category"
          ref={categoryRef}
          defaultValue="tea"
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="tea">Tea</option>
          <option value="oil">Oil</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto block"
      >
        Add Item
      </button>
    </form>
  </div>
  <div className="w-1/2 p-4 h-full overflow-y-auto bg-white shadow-lg rounded-lg">
    <ListAddedItems />
  </div>
</div>

  );
};

export default AddItem;
