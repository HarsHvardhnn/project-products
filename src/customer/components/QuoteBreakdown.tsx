import React from 'react';
import { DollarSign, ChevronDown, ChevronUp, Download, Printer } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export const QuoteBreakdown: React.FC = () => {
  const { quote } = useQuote();
  const [expandedSection, setExpandedSection] = React.useState<string | null>('products');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate totals
  const productsTotal = quote.products.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
  const materialsTotal = quote.materials.reduce((sum, material) => sum + material.price, 0);
  const laborTotal = quote.labor;
  const grandTotal = productsTotal + materialsTotal + laborTotal;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Quote Breakdown</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-700">Total Project Cost</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Quote #: {quote.quoteNumber}</p>
            <p className="text-sm text-gray-500">Date: {quote.date}</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div 
          className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('products')}
        >
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Products</h3>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900 mr-3">{formatCurrency(productsTotal)}</span>
            {expandedSection === 'products' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
        
        {expandedSection === 'products' && (
          <div className="p-4">
            <div className="space-y-3">
              {quote.products.map(product => (
                <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category} - {product.brand}</p>
                      <div className="text-xs text-blue-600 mt-0.5">
                        Quantity: {product.quantity || 1} × {formatCurrency(product.price)}
                      </div>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(product.price * (product.quantity || 1))}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Materials Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div 
          className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('materials')}
        >
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Materials</h3>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900 mr-3">{formatCurrency(materialsTotal)}</span>
            {expandedSection === 'materials' ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </div>
        </div>
        
        {expandedSection === 'materials' && (
          <div className="p-4">
            <div className="space-y-3">
              {quote.materials.map(material => (
                <div key={material.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{material.name}</p>
                    <p className="text-sm text-gray-500">{material.description}</p>
                  </div>
                  <p className="font-medium text-gray-900">{formatCurrency(material.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Labor Section */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Labor</h3>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(laborTotal)}</span>
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">{quote.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};