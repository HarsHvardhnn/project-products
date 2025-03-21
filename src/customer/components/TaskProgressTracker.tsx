import React, { useState } from 'react';
import { useTasks, TaskStatus, VerificationType } from '../context/TaskContext';
import { Calendar, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Info, DollarSign, Camera, FileText, Video, X } from 'lucide-react';
import { ChangeOrderModal } from './ChangeOrderModal';
import { VerificationViewer } from './VerificationViewer';

interface TaskProgressTrackerProps {
  onBack?: () => void;
}

export const TaskProgressTracker: React.FC<TaskProgressTrackerProps> = ({ onBack }) => {
  const { tasks, requestVerification, removeVerification } = useTasks();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showVerificationOptions, setShowVerificationOptions] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showVerificationViewer, setShowVerificationViewer] = useState(false);
  const [selectedVerificationType, setSelectedVerificationType] = useState<'photo' | 'video' | 'inspection' | null>(null);

  // Calculate progress statistics
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const notStartedTasks = tasks.filter(task => task.status === 'not-started').length;
  const totalTasks = tasks.length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge styling and icon
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4 mr-1" />
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="w-4 h-4 mr-1" />
        };
      case 'not-started':
        return {
          label: 'Not Started',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: <AlertCircle className="w-4 h-4 mr-1" />
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: <Info className="w-4 h-4 mr-1" />
        };
    }
  };

  // Get verification type icon and color
  const getVerificationInfo = (type: VerificationType) => {
    switch (type) {
      case 'photo':
        return {
          label: 'Photo Verification',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Camera className="w-4 h-4 mr-2" />
        };
      case 'video':
        return {
          label: 'Video Verification',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Video className="w-4 h-4 mr-2" />
        };
      case 'inspection':
        return {
          label: 'Inspection Required',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <CheckCircle className="w-4 h-4 mr-2" />
        };
      default:
        return {
          label: 'Verification Required',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: <Info className="w-4 h-4 mr-2" />
        };
    }
  };

  const toggleTaskDetails = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleRequestVerification = (taskId: string, type: VerificationType) => {
    requestVerification(taskId, type);
    setShowVerificationOptions(null);
  };

  const handleRemoveVerification = (taskId: string, type: string) => {
    removeVerification(taskId, type);
  };

  const handleViewVerification = (type: 'photo' | 'video' | 'inspection') => {
    setSelectedVerificationType(type);
    setShowVerificationViewer(true);
  };

  const handleApprovePayment = (taskId: string) => {
    // In a real app, this would approve the payment
    console.log(`Approved payment for task ${taskId}`);
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Payment approved successfully!');
  };

  const togglePanelCollapse = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with toggle button */}
      <div className="flex items-center justify-between mb-6 cursor-pointer" onClick={togglePanelCollapse}>
        <h2 className="text-xl font-semibold text-gray-800">Project Progress</h2>
        <button 
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isPanelCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isPanelCollapsed ? 
            <ChevronDown className="h-5 w-5 text-gray-500" /> : 
            <ChevronUp className="h-5 w-5 text-gray-500" />
          }
        </button>
      </div>
      
      {/* Progress Summary - Always visible */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700">{progressPercentage}% Complete</span>
            <span className="ml-4 text-sm text-gray-500">
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-gray-800">Completed ({completedTasks})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-gray-800">In Progress ({inProgressTasks})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
              <span className="text-gray-800">Not Started ({notStartedTasks})</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Tasks List - Collapsible */}
      {!isPanelCollapsed && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const isExpanded = expandedTaskId === task.id;
            
            // Determine if this task has a payment milestone
            const hasPayment = task.isMilestonePayment && task.paymentAmount && task.paymentAmount > 0;
            const paymentRequested = hasPayment && task.paymentRequested;
            const paymentApproved = hasPayment && task.paymentApproved;
            
            // Collect all verification requirements
            const verificationTypes: VerificationType[] = [];
            if (task.verificationType) {
              verificationTypes.push(task.verificationType);
            }
            if (task.verificationRequests && task.verificationRequests.length > 0) {
              task.verificationRequests.forEach(type => {
                if (type && !verificationTypes.includes(type)) {
                  verificationTypes.push(type);
                }
              });
            }
            
            return (
              <div 
                key={task.id} 
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
              >
                {/* Task Header */}
                <div 
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                    task.status === 'completed' ? 'bg-green-50' : 
                    task.status === 'in-progress' ? 'bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => toggleTaskDetails(task.id)}
                >
                  <div className="flex items-center">
                    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} mr-3`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                    
                    {/* Payment Badge - Only show for milestone payments */}
                    {hasPayment && (
                      <div className={`ml-3 flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paymentApproved ? 'bg-green-100 text-green-800' : 
                        paymentRequested ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <DollarSign className="w-3 h-3 mr-1" />
                        <span>
                          {paymentApproved ? 'Paid' : 
                           paymentRequested ? 'Payment Due' : 
                           'Payment Scheduled'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4 hidden md:block">
                      Due: {formatDate(task.dueDate)}
                    </div>
                    {isExpanded ? 
                      <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
                
                {/* Task Details (Expanded) */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Start Date</div>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-800">{formatDate(task.startDate)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Due Date</div>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-800">{formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                      {task.status === 'completed' && (
                        <div>
                          <div className="text-sm font-medium text-gray-500">Completed Date</div>
                          <div className="flex items-center mt-1">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-gray-800">{formatDate(task.completedDate)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Information - Only show for milestone payments */}
                    {hasPayment && (
                      <div className={`mt-4 p-4 rounded-lg border ${
                        paymentApproved ? 'bg-green-50 border-green-200' : 
                        paymentRequested ? 'bg-yellow-50 border-yellow-200' : 
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Milestone Payment
                          </h4>
                          <span className="font-semibold text-gray-900">{formatCurrency(task.paymentAmount || 0)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {paymentApproved ? 'Payment has been approved and processed.' : 
                           paymentRequested ? 'Contractor has requested payment for this milestone.' : 
                           'Payment will be requested upon completion of this milestone.'}
                        </div>
                        
                        {paymentRequested && !paymentApproved && (
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => setShowVerificationOptions(showVerificationOptions === task.id ? null : task.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Request Verification
                            </button>
                            
                            {showVerificationOptions === task.id && (
                              <div className="absolute mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button 
                                  onClick={() => handleRequestVerification(task.id, 'photo')}
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <Camera className="w-4 h-4 text-blue-500 mr-2" />
                                  <span>Request Photos</span>
                                </button>
                                <button 
                                  onClick={() => handleRequestVerification(task.id, 'video')}
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <Video className="w-4 h-4 text-purple-500 mr-2" />
                                  <span>Request Video</span>
                                </button>
                                <button 
                                  onClick={() => handleRequestVerification(task.id, 'inspection')}
                                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-800"
                                >
                                  <CheckCircle className="w-4 h-4 text-amber-500 mr-2" />
                                  <span>Request Inspection</span>
                                </button>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => handleApprovePayment(task.id)}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              Approve Payment
                            </button>
                          </div>
                        )}
                        
                        {/* Verification Requirements Section */}
                        {verificationTypes.length > 0 && (
                          <div className="mt-4 border-t border-gray-200 pt-3">
                            <h5 className="font-medium text-gray-700 mb-2">Required Verifications:</h5>
                            <div className="space-y-2">
                              {verificationTypes.map((type, index) => {
                                if (!type) return null;
                                const verificationInfo = getVerificationInfo(type);
                                return (
                                  <div 
                                    key={`${type}-${index}`} 
                                    className="flex items-center justify-between"
                                  >
                                    <div className={`flex items-center px-3 py-1.5 rounded-md ${verificationInfo.color}`}>
                                      {verificationInfo.icon}
                                      <span className="text-sm">{verificationInfo.label}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleViewVerification(type)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                      >
                                        View
                                      </button>
                                      <button
                                        onClick={() => handleRemoveVerification(task.id, type)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Change Order Section */}
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Change Order</div>
                      <div className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-3">CO-001</span>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Accepted
                            </span>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">+$1,200.00</span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">Description</p>
                            <p className="text-sm text-gray-600">
                              Addition of under-cabinet lighting throughout the kitchen
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Accepted On</p>
                              <p className="text-sm text-gray-900">{formatDate('2025-06-15')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Timeline Impact</p>
                              <p className="text-sm text-gray-900">+3 days</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">Required Selections</p>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                                Under Cabinet LED Strips
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                                Dimmer Switch
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 mt-3 border-t border-gray-200">
                            <button
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setShowChangeOrderModal(true);
                              }}
                              className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Change Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-500 mb-1">Notes</div>
                        <div className="bg-white p-3 rounded-md border border-gray-200 text-gray-700">
                          {task.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Change Order Modal */}
      {showChangeOrderModal && selectedTaskId && (
        <ChangeOrderModal
          taskId={selectedTaskId}
          isOpen={showChangeOrderModal}
          onClose={() => {
            setShowChangeOrderModal(false);
            setSelectedTaskId(null);
          }}
        />
      )}

      {/* Verification Viewer */}
      {showVerificationViewer && selectedVerificationType && (
        <VerificationViewer
          type={selectedVerificationType}
          isOpen={showVerificationViewer}
          onClose={() => {
            setShowVerificationViewer(false);
            setSelectedVerificationType(null);
          }}
        />
      )}
    </div>
  );
};