import React from 'react';
import { Clock } from 'lucide-react';
import { PendingQuoteCard } from './quotes/PendingQuoteCard';

export const QuotesPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Quotes</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Pending Quotes Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-800">Pending Quotes</h2>
        <PendingQuoteCard
          projectName="Kitchen Remodel"
          customerName="Sarah Johnson"
          projectType="Kitchen Remodeling"
        />
      </div>
    </div>
  );
};