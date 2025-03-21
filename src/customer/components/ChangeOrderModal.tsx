import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertCircle, User, Clock, Plus } from 'lucide-react';

interface ChangeOrderModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChangeOrder {
  id: string;
  type: 'Additional Scope' | 'Altered Scope';
  description: string;
  reason: string;
  requestedBy: string;
  requestedDate: string;
  timeAdjustment: number;
  costAdjustment: number;
  status: 'pending' | 'accepted' | 'rejected' | 'questioned';
  acceptedDate?: string;
  requiredSelections?: string[];
}

export const ChangeOrderModal: React.FC<ChangeOrderModalProps> = ({
  taskId,
  isOpen,
  onClose
}) => {
  // Sample change order data - in a real app this would come from props or an API
  const [changeOrder] = useState<ChangeOrder>({
    id: 'CO-001',
    type: 'Additional Scope',
    description: 'Addition of under-cabinet lighting throughout the kitchen',
    reason: 'Customer requested enhanced task lighting for better workspace illumination',
    requestedBy: 'Michael Chen (Contractor)',
    requestedDate: '6/14/2025',
    timeAdjustment: 3,
    costAdjustment: 1200,
    status: 'accepted',
    acceptedDate: '6/15/2025',
    requiredSelections: ['Under Cabinet LED Strips', 'Dimmer Switch']
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Change Order</h3>
              <p className="mt-1 text-sm text-gray-500">Reference: {changeOrder.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Accepted
            </span>
          </div>

          {/* Change Order Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="mt-1 text-gray-900">{changeOrder.type}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1 text-gray-900">{changeOrder.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="mt-1 text-gray-900">{changeOrder.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Requested By</p>
                <div className="mt-1 flex items-center text-gray-900">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  {changeOrder.requestedBy}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Requested</p>
                <div className="mt-1 flex items-center text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {changeOrder.requestedDate}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Time Adjustment</p>
                <div className="mt-1 flex items-center text-gray-900">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  {changeOrder.timeAdjustment} days
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost Adjustment</p>
                <div className="mt-1 flex items-center text-gray-900">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  ${changeOrder.costAdjustment.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Acceptance Date */}
            <div>
              <p className="text-sm text-gray-500">Accepted On</p>
              <div className="mt-1 flex items-center text-gray-900">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                {changeOrder.acceptedDate}
              </div>
            </div>

            {/* Required Selections */}
            {changeOrder.requiredSelections && (
              <div>
                <p className="text-sm text-gray-500">Required Selections</p>
                <div className="mt-2 space-y-2">
                  {changeOrder.requiredSelections.map((item, index) => (
                    <div key={index} className="flex items-center text-gray-900">
                      <Plus className="w-4 h-4 text-blue-500 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Considerations */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-800 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Considerations</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• This change will extend the project timeline</li>
                    <li>• Additional materials will need to be ordered</li>
                    <li>• New selections will be required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};