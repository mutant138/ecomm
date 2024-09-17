import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const data = [
  {
    id: 1,
    img: "https://cdn.zeptonow.com/production///tr:w-969,ar-969-558,pr-true,f-auto,q-80/inventory/banner/45a13d54-42e5-4fa6-bcab-6ee0525d8c59.png",
  },
  {
    id: 2,
    img: "https://cdn.zeptonow.com/production///tr:w-640,ar-969-558,pr-true,f-auto,q-80/inventory/banner/2c36ad1a-51f9-447f-87d1-82f25811e36d.png",
  },
  {
    id: 3,
    img: "https://cdn.zeptonow.com/production///tr:w-640,ar-969-558,pr-true,f-auto,q-80/inventory/banner/4343d65a-f4ec-4c29-a926-d2438b285f15.png",
  },
  {
    id: 4,
    img: "https://cdn.zeptonow.com/production///tr:w-640,ar-969-558,pr-true,f-auto,q-80/inventory/banner/c4bec8eb-93a6-42d8-a2a3-0ab8f376b88d.png",
  },
];

const Card = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="flex justify-center items-center px-20 py-5">
        <img
          src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/11.8.3/tr:w-1280,ar-1438-235,pr-true,f-auto,q-80//images/paan-corner/paan-corner-banner-desktop.png"
          alt="Main banner"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="relative flex justify-center items-center px-20 py-5">
        <img
          src={data[currentIndex].img}
          alt={`Banner ${currentIndex + 1}`}
          className="w-full h-48 object-cover object-center"
        />
    
        <div
          onClick={handlePrev} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-3xl bg-gray-800 p-3 rounded-full hover:bg-gray-700"
        >
          <FaChevronLeft />
        </div>
        <div
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-white text-3xl bg-gray-800 p-3 rounded-full hover:bg-gray-700"
        >
          <FaChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Card;
