import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle, Info, X, ChevronDown, ChevronUp, Calendar, DollarSign, PenTool as Tool, MessageSquare } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'task' | 'payment' | 'inspection' | 'message';
}

interface AlertsPanelProps {
  onBack?: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    unread: true,
    today: true,
    earlier: true
  });

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'success',
      title: 'Task Completed',
      message: 'Cabinet installation has been completed',
      timestamp: '10 minutes ago',
      isRead: false,
      category: 'task'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Payment Due',
      message: 'Upcoming milestone payment due in 3 days',
      timestamp: '1 hour ago',
      isRead: false,
      category: 'payment'
    },
    {
      id: '3',
      type: 'info',
      title: 'Inspection Scheduled',
      message: 'Plumbing inspection scheduled for tomorrow at 10 AM',
      timestamp: '2 hours ago',
      isRead: true,
      category: 'inspection'
    },
    {
      id: '4',
      type: 'info',
      title: 'New Message',
      message: 'New message from your contractor',
      timestamp: '3 hours ago',
      isRead: true,
      category: 'message'
    },
    {
      id: '5',
      type: 'error',
      title: 'Inspection Failed',
      message: 'Electrical inspection requires corrections',
      timestamp: 'Yesterday',
      isRead: true,
      category: 'inspection'
    }
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAlertIcon = (type: string, category: string) => {
    switch (category) {
      case 'task':
        return <Tool className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'inspection':
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      default:
        switch (type) {
          case 'success':
            return <CheckCircle className="w-5 h-5" />;
          case 'warning':
            return <AlertTriangle className="w-5 h-5" />;
          case 'info':
            return <Info className="w-5 h-5" />;
          case 'error':
            return <X className="w-5 h-5" />;
          default:
            return <Bell className="w-5 h-5" />;
        }
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-100';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-100';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-100';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-100';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const todayAlerts = alerts.filter(alert => 
    alert.isRead && alert.timestamp.includes('ago') || alert.timestamp === 'Today'
  );
  const earlierAlerts = alerts.filter(alert => 
    alert.isRead && !alert.timestamp.includes('ago') && alert.timestamp !== 'Today'
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Last updated: Just now
        </div>
      </div>

      <div className="space-y-6">
        {/* Unread Alerts */}
        {unreadAlerts.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('unread')}
            >
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">Unread</h3>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadAlerts.length}
                </span>
              </div>
              {expandedSections.unread ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </div>
            
            {expandedSections.unread && (
              <div className="divide-y divide-gray-200">
                {unreadAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-4 ${getAlertStyles(alert.type)} transition-colors hover:bg-opacity-80`}
                  >
                    <div className="flex items-start">
                      <div className={`${getIconStyles(alert.type)} flex-shrink-0 mr-3`}>
                        {getAlertIcon(alert.type, alert.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <span className="text-xs">{alert.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Today's Alerts */}
        {todayAlerts.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('today')}
            >
              <h3 className="text-lg font-medium text-gray-900">Today</h3>
              {expandedSections.today ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </div>
            
            {expandedSections.today && (
              <div className="divide-y divide-gray-200">
                {todayAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className={`${getIconStyles(alert.type)} flex-shrink-0 mr-3`}>
                        {getAlertIcon(alert.type, alert.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Earlier Alerts */}
        {earlierAlerts.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('earlier')}
            >
              <h3 className="text-lg font-medium text-gray-900">Earlier</h3>
              {expandedSections.earlier ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </div>
            
            {expandedSections.earlier && (
              <div className="divide-y divide-gray-200">
                {earlierAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className="p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className={`${getIconStyles(alert.type)} flex-shrink-0 mr-3`}>
                        {getAlertIcon(alert.type, alert.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};