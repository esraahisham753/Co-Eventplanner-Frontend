'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-shadow hover:shadow-md"
        >
          <button
            className="w-full px-6 py-4 text-left md:text-left text-center flex justify-between items-center focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-lg font-medium text-gray-900 flex-1">{item.question}</span>
            <span className="text-primary ml-4 flex-shrink-0">
              {activeIndex === index ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
            </span>
          </button>
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out text-center md:text-left ${
              activeIndex === index ? 'max-h-96 py-4' : 'max-h-0'
            }`}
          >
            <p className="text-gray-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion; 