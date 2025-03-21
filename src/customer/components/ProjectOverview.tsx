import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Calendar, Clock, CheckCircle, AlertCircle, UserPlus, ChevronDown, ChevronUp, Building2, Shield, User, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { AssignStakeholderModal } from './AssignStakeholderModal';

interface Stakeholder {
  id: string;
  name: string;
  company: string;
  type: 'financial' | 'insurance' | 'inspector' | 'realtor' | 'investor';
  email: string;
  phone?: string;
  address: string;
  status: 'active' | 'pending';
  logo?: string;
  contactPerson?: {
    name: string;
    title: string;
    phone: string;
    email: string;
    photo?: string;
  };
}

export const ProjectOverview: React.FC = () => {
  const { projectName, customerName, contractorName, projectStatus, projectId } = useProject();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStakeholders, setShowStakeholders] = useState(true);

  // Sample stakeholders data with logos and contact person photos
  const [stakeholders] = useState<Stakeholder[]>([
    {
      id: '1',
      name: 'First National Bank',
      company: 'First National Bank',
      type: 'financial',
      email: 'contact@fnb.com',
      phone: '(212) 555-0123',
      address: '123 Financial Ave, New York, NY 10001',
      status: 'active',
      logo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80',
      contactPerson: {
        name: 'John Smith',
        title: 'Loan Officer',
        phone: '(212) 555-0124',
        email: 'john.smith@fnb.com',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
      }
    },
    {
      id: '2',
      name: 'SafeGuard Insurance',
      company: 'SafeGuard Insurance Co.',
      type: 'insurance',
      email: 'info@safeguard.com',
      phone: '(312) 555-0456',
      address: '456 Insurance Blvd, Chicago, IL 60601',
      status: 'pending',
      logo: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80',
      contactPerson: {
        name: 'Emily Johnson',
        title: 'Insurance Agent',
        phone: '(312) 555-0457',
        email: 'emily.johnson@safeguard.com',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
      }
    }
  ]);

  // Function to get status display information
  const getStatusInfo = () => {
    switch (projectStatus) {
      case 'awaiting-finalization':
        return {
          label: 'Awaiting Finalization',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-5 h-5 mr-2" />
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <AlertCircle className="w-5 h-5 mr-2" />
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5 mr-2" />
        };
      default:
        return {
          label: 'Unknown Status',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-5 h-5 mr-2" />
        };
    }
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'inspector':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'realtor':
        return <Building2 className="w-5 h-5 text-orange-600" />;
      case 'investor':
        return <Building2 className="w-5 h-5 text-yellow-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleMessageClick = (stakeholder: Stakeholder) => {
    // Get the parent element that contains the messages panel
    const dashboardLayout = document.querySelector('.min-h-screen.bg-gray-50');
    if (!dashboardLayout) return;

    // Find the messages button in the header
    const messagesButton = dashboardLayout.querySelector('button[aria-label="Open Messages"]');
    if (messagesButton instanceof HTMLButtonElement) {
      messagesButton.click();
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <div className="space-y-6">
        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{projectName}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600 space-y-1 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <span className="font-medium">Customer:</span>
                  <span className="ml-2">{customerName}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Contractor:</span>
                  <span className="ml-2">{contractorName}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span>Project ID: {projectId}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Stakeholder
              </button>
              <div className={`flex items-center px-4 py-2 rounded-lg border ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="font-medium">{statusInfo.label}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Started: June 1, 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholders Panel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
            onClick={() => setShowStakeholders(!showStakeholders)}
          >
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-800">Project Stakeholders</h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stakeholders.length}
              </span>
            </div>
            {showStakeholders ? 
              <ChevronUp className="h-5 w-5 text-gray-400" /> : 
              <ChevronDown className="h-5 w-5 text-gray-400" />
            }
          </div>

          {showStakeholders && (
            <div className="divide-y divide-gray-200">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {stakeholder.logo ? (
                          <img 
                            src={stakeholder.logo} 
                            alt={stakeholder.name} 
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          getStakeholderIcon(stakeholder.type)
                        )}
                      </div>
                      <div className="flex space-x-6">
                        {/* Main Stakeholder Info */}
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{stakeholder.name}</h3>
                            <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                              stakeholder.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {stakeholder.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{stakeholder.company}</p>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-2" />
                              {stakeholder.address}
                            </div>
                            {stakeholder.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-4 h-4 mr-2" />
                                {stakeholder.phone}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-4 h-4 mr-2" />
                              {stakeholder.email}
                            </div>
                          </div>
                        </div>

                        {/* Contact Person Info */}
                        {stakeholder.contactPerson && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Contact Person</p>
                            <div className="flex items-center space-x-3">
                              {stakeholder.contactPerson.photo ? (
                                <img 
                                  src={stakeholder.contactPerson.photo}
                                  alt={stakeholder.contactPerson.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {stakeholder.contactPerson.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {stakeholder.contactPerson.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {stakeholder.contactPerson.phone}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {stakeholder.contactPerson.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Button */}
                    <button
                      onClick={() => handleMessageClick(stakeholder)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}

              {stakeholders.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No stakeholders assigned yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AssignStakeholderModal 
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
      />
    </>
  );
};