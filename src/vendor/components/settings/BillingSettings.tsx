import React from 'react';
import { DollarSign, Download, Clock, Target } from 'lucide-react';

export const BillingSettings: React.FC = () => {
  const billingHistory = [
    {
      id: 'inv1',
      date: '2025-03-15',
      amount: 1000,
      status: 'paid',
      invoice: '#INV-2025-001'
    },
    {
      id: 'inv2',
      date: '2025-02-15',
      amount: 1000,
      status: 'paid',
      invoice: '#INV-2025-002'
    }
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Current Marketing Plan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Marketing Plan</h3>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">Premium Market Domination</h4>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500 mr-2">Monthly Budget:</span>
              <span className="text-lg font-bold text-gray-900">$1000</span>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500">$2.5/click • Up to 400 clicks per month</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">Started on 3/14/2025</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.invoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};