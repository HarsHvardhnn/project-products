import React from 'react';
import { X, Users, FileText, MessageSquare, Bell } from 'lucide-react';

interface NotificationsPanelProps {
  onClose: () => void;
  onNavigate?: (panel: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose, onNavigate }) => {
  const notifications = [
    {
      id: 1,
      type: 'lead',
      title: 'New Lead Generated',
      message: 'Sarah Johnson - Kitchen Remodel Consultation',
      time: '10 minutes ago',
      icon: <Users className="w-5 h-5 text-blue-500" />,
      targetPanel: 'leads'
    },
    {
      id: 2,
      type: 'project',
      title: 'Project Update',
      message: 'Bathroom renovation milestone completed',
      time: '1 hour ago',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      targetPanel: 'projects'
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Michael Chen sent a message about cabinet selection',
      time: '2 hours ago',
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      targetPanel: 'messages'
    }
  ];

  const handleNotificationClick = (targetPanel: string) => {
    if (onNavigate) {
      onNavigate(targetPanel);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.targetPanel)}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {notification.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};