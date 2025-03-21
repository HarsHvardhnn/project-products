import React, { useState } from 'react';
import { QwilloLogo } from '../../components/QwilloLogo';
import { Bell, MessageSquare, Settings, User, X } from 'lucide-react';
import { ContractorCommunication } from './ContractorCommunication';
import { SettingsPanel } from './SettingsPanel';
import { AlertsPanel } from './AlertsPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [showCommunicationPanel, setShowCommunicationPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);

  const toggleCommunicationPanel = () => {
    setShowCommunicationPanel(!showCommunicationPanel);
  };

  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
    if (showAlertsPanel) setShowAlertsPanel(false);
    if (showCommunicationPanel) setShowCommunicationPanel(false);
  };

  const toggleAlertsPanel = () => {
    setShowAlertsPanel(!showAlertsPanel);
    if (showSettingsPanel) setShowSettingsPanel(false);
    if (showCommunicationPanel) setShowCommunicationPanel(false);
  };

  const handleBack = () => {
    setShowSettingsPanel(false);
    setShowAlertsPanel(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-32 h-8">
                <QwilloLogo variant="full" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                onClick={toggleAlertsPanel}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                onClick={toggleCommunicationPanel}
                aria-label="Open Messages"
              >
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleSettingsPanel}
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  SJ
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">Sarah Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSettingsPanel ? <SettingsPanel onBack={handleBack} /> : 
         showAlertsPanel ? <AlertsPanel onBack={handleBack} /> : 
         children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="w-24 h-6">
                <QwilloLogo variant="full" />
              </div>
              <p className="text-sm text-gray-500 mt-1">© 2025 Qwillo. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Help Center</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Communication Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          showCommunicationPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button 
              onClick={toggleCommunicationPanel}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ContractorCommunication />
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {(showCommunicationPanel || showSettingsPanel || showAlertsPanel) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => {
            setShowCommunicationPanel(false);
            setShowSettingsPanel(false);
            setShowAlertsPanel(false);
          }}
        ></div>
      )}
    </div>
  );
};