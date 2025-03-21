import React, { useState } from 'react';
import { Clock, AlertCircle, ChevronDown, X } from 'lucide-react';
import { Task } from './types';

interface TaskActionsProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task, onUpdateTask }) => {
  const [showDelayOptions, setShowDelayOptions] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [delayNotes, setDelayNotes] = useState('');
  const [pendingStatus, setPendingStatus] = useState<'in-progress' | 'completed' | null>(null);

  const handleStatusChange = (newStatus: 'in-progress' | 'completed') => {
    setPendingStatus(newStatus);
  };

  const handleStatusConfirm = () => {
    if (!pendingStatus) return;
    
    onUpdateTask({
      ...task,
      status: pendingStatus,
      completedDate: pendingStatus === 'completed' ? new Date().toISOString() : undefined
    });
    setPendingStatus(null);
  };

  const handleStatusCancel = () => {
    setPendingStatus(null);
  };

  const handleDelay = (reason: string) => {
    if (!delayNotes.trim()) return;

    const newDelay = {
      reason,
      notes: delayNotes,
      date: new Date().toISOString()
    };

    onUpdateTask({
      ...task,
      delays: [...(task.delays || []), newDelay]
    });

    setShowDelayOptions(false);
    setDelayReason('');
    setDelayNotes('');
  };

  const handleRemoveDelay = (index: number) => {
    if (!task.delays) return;

    const updatedDelays = task.delays.filter((_, i) => i !== index);
    onUpdateTask({
      ...task,
      delays: updatedDelays
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Status Controls */}
      <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Task Status</span>
          <div className="flex space-x-2">
            {task.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  task.status === 'in-progress'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {task.status === 'in-progress' ? 'In Progress' : 'Start'}
              </button>
            )}
            {task.status === 'in-progress' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  task.status === 'completed'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                Complete
              </button>
            )}
          </div>
        </div>

        {/* Status Change Confirmation */}
        {pendingStatus && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Confirm changing status to {pendingStatus === 'in-progress' ? 'Started' : 'Completed'}?
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleStatusCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusConfirm}
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delay Controls */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Delay Status</span>
          <button
            onClick={() => setShowDelayOptions(!showDelayOptions)}
            className="px-3 py-1.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Report Delay
          </button>
        </div>

        {showDelayOptions && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay Reason
              </label>
              <select
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select reason...</option>
                <option value="weather">Weather</option>
                <option value="material-delivery">Material Delivery</option>
                <option value="scheduling">Scheduling</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={delayNotes}
                onChange={(e) => setDelayNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder="Provide details about the delay..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowDelayOptions(false);
                  setDelayReason('');
                  setDelayNotes('');
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelay(delayReason)}
                disabled={!delayReason || !delayNotes.trim()}
                className="px-3 py-1.5 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Delay
              </button>
            </div>
          </div>
        )}

        {/* Delay History */}
        {task.delays && task.delays.length > 0 && (
          <div className="mt-3 space-y-3">
            {task.delays.map((delay, index) => (
              <div key={index} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        Delay Reported: {formatDate(delay.date)}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Reason: {delay.reason.charAt(0).toUpperCase() + delay.reason.slice(1)}
                      </p>
                      <p className="text-sm text-orange-700 mt-1">{delay.notes}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDelay(index)}
                    className="text-orange-600 hover:text-orange-800 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};