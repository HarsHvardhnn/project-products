import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { ProjectOverview } from './components/ProjectOverview';
import { TaskProgressTracker } from './components/TaskProgressTracker';
import { ProductSelections } from './components/ProductSelections';
import { QuoteBreakdown } from './components/QuoteBreakdown';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { ProductProvider } from './context/ProductContext';
import { QuoteProvider } from './context/QuoteContext';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { RelatedServicesCarousel } from './components/RelatedServicesCarousel';

export const CustomerDashboard: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <ProjectProvider>
      <TaskProvider>
        <ProductProvider>
          <QuoteProvider>
            <div className="relative min-h-screen">
              {/* Dashboard is always rendered but initially invisible */}
              <div className={`transition-opacity duration-500 ${showDashboard ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <DashboardLayout>
                  <div className="space-y-6">
                    <ProjectOverview />
                    <TaskProgressTracker />
                    <ProductSelections />
                    <RelatedServicesCarousel />
                    <QuoteBreakdown />
                  </div>
                </DashboardLayout>
              </div>

              {/* Welcome animation overlay */}
              {!showDashboard && (
                <WelcomeAnimation onComplete={() => setShowDashboard(true)} />
              )}
            </div>
          </QuoteProvider>
        </ProductProvider>
      </TaskProvider>
    </ProjectProvider>
  );
};