import React, { useState } from 'react';
import { SideNavigation } from './components/SideNavigation';
import { OverviewPanel } from './components/OverviewPanel';
import { ProductsPanel } from './components/products/ProductsPanel';
import { ServicesPanel } from './components/services/ServicesPanel';
import { MarketingPlansPanel } from './components/marketing/MarketingPlansPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { Bell } from 'lucide-react';

type PanelType = 'overview' | 'products' | 'services' | 'marketing' | 'orders' | 'analytics' | 'settings';

export const VendorDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel />;
      case 'products':
        return <ProductsPanel />;
      case 'services':
        return <ServicesPanel />;
      case 'marketing':
        return <MarketingPlansPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation */}
      <SideNavigation 
        activePanel={activePanel} 
        onPanelChange={setActivePanel} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                CW
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                Culligan Water
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
};