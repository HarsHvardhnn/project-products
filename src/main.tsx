import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProjectProvider } from './contractor/context/ProjectContext';
import App from './App';
import { TestMeetingEntry } from './standalone/TestMeetingEntry';
import { StakeholderDashboard } from './stakeholder/StakeholderDashboard';
import { CustomerDashboard } from './customer/CustomerDashboard';
import { ContractorDashboard } from './contractor/ContractorDashboard';
import { VendorDashboard } from './vendor/VendorDashboard';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/landingpage',
    element: <App />
  },
  {
    path: '/meeting/:id',
    element: <TestMeetingEntry />
  },
  {
    path: '/stakeholder',
    element: <StakeholderDashboard />
  },
  {
    path: '/customer',
    element: <CustomerDashboard />
  },
  {
    path: '/contractor',
    element: (
      <ProjectProvider>
        <ContractorDashboard />
      </ProjectProvider>
    )
  },
  {
    path: '/vendor',
    element: <VendorDashboard />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);