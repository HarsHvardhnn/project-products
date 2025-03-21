import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckSquare, Square, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

interface ChecklistItem {
  id: string;
  category: string;
  name: string;
  isComplete: boolean;
  matchTerms: string[];
}

export const ProductChecklist: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { selectedProducts, products } = useProducts();
  const [checklist] = useState<ChecklistItem[]>([
    { 
      id: '1', 
      category: 'Appliances', 
      name: 'Refrigerator', 
      isComplete: false,
      matchTerms: ['refrigerator', 'fridge']
    },
    { 
      id: '2', 
      category: 'Appliances', 
      name: 'Range/Stove', 
      isComplete: false,
      matchTerms: ['range', 'stove', 'oven']
    },
    { 
      id: '3', 
      category: 'Appliances', 
      name: 'Dishwasher', 
      isComplete: false,
      matchTerms: ['dishwasher']
    },
    { 
      id: '4', 
      category: 'Cabinetry', 
      name: 'Kitchen Cabinets', 
      isComplete: false,
      matchTerms: ['cabinet', 'cabinetry']
    },
    { 
      id: '5', 
      category: 'Countertops', 
      name: 'Kitchen Countertops', 
      isComplete: false,
      matchTerms: ['countertop', 'quartz', 'granite', 'marble']
    }
  ]);

  // Calculate which items are complete based on selected products
  const completedItems = checklist.map(item => {
    const isComplete = selectedProducts.some(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return false;

      // Check if the product name or category matches any of the match terms
      return item.matchTerms.some(term => 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term)
      );
    });

    return {
      ...item,
      isComplete
    };
  });

  const progress = (completedItems.filter(item => item.isComplete).length / checklist.length) * 100;

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Required Selections</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">
            {completedItems.filter(item => item.isComplete).length} of {checklist.length} complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="p-4 space-y-4">
        {completedItems.map(item => (
          <div 
            key={item.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
              item.isComplete ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.isComplete ? (
                <CheckSquare className="w-5 h-5 text-blue-500" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className={`font-medium ${
                item.isComplete ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {item.name}
              </p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Select products from the store to complete your checklist
        </p>
      </div>
    </div>
  );
};