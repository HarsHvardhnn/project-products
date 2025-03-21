import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewPanel } from './components/OverviewPanel';
import { LeadsPanel } from './components/leads/LeadsPanel';
import { ProjectsPanel } from './components/projects/ProjectsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { SubContractorsPanel } from './components/subcontractors/SubContractorsPanel';
import { QuotesPanel } from './components/QuotesPanel';
import { CreateMeetingModal } from './components/CreateMeetingModal';
import { QwilloAIFloating } from '../components/QwilloAIFloating';

type PanelType = 'overview' | 'quotes' | 'leads' | 'projects' | 'messages' | 'settings' | 'subcontractors';

export const ContractorDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('overview');
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel onCreateMeeting={() => setShowCreateMeeting(true)} />;
      case 'quotes':
        return <QuotesPanel />;
      case 'leads':
        return <LeadsPanel />;
      case 'projects':
        return <ProjectsPanel onPanelChange={handlePanelChange} />;
      case 'messages':
        return <MessagesPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'subcontractors':
        return <SubContractorsPanel />;
      default:
        return <OverviewPanel onCreateMeeting={() => setShowCreateMeeting(true)} />;
    }
  };

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel as PanelType);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout activePanel={activePanel} onPanelChange={setActivePanel}>
        {renderPanel()}
      </DashboardLayout>

      {/* Create Meeting Modal */}
      <CreateMeetingModal 
        isOpen={showCreateMeeting}
        onClose={() => setShowCreateMeeting(false)}
      />

      {/* Qwillo AI Floating Assistant */}
      <QwilloAIFloating />
    </div>
  );
};