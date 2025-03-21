import React, { createContext, useContext, useState } from 'react';

// Define the project status types
export type ProjectStatus = 'awaiting-finalization' | 'in-progress' | 'completed';

// Define the project context interface
interface ProjectContextType {
  projectName: string;
  customerName: string;
  contractorName: string;
  projectStatus: ProjectStatus;
  projectId: string;
  setProjectName: (name: string) => void;
  setCustomerName: (name: string) => void;
  setContractorName: (name: string) => void;
  setProjectStatus: (status: ProjectStatus) => void;
}

// Create the context with default values
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectName, setProjectName] = useState<string>('Kitchen Remodel');
  const [customerName, setCustomerName] = useState<string>('Sarah Johnson');
  const [contractorName, setContractorName] = useState<string>('J9 Construction, LLC');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('in-progress');
  const [projectId] = useState<string>('PRJ-2025-001');

  const value = {
    projectName,
    customerName,
    contractorName,
    projectStatus,
    projectId,
    setProjectName,
    setCustomerName,
    setContractorName,
    setProjectStatus
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};