import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { ProjectManagement } from '../project-management/ProjectManagement';

interface ProjectsPanelProps {
  onPanelChange?: (panel: string) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({ onPanelChange }) => {
  // Sample active projects data
  const [activeProjects] = useState([
    {
      id: 1,
      name: "Smith Home Remodel",
      customerName: "Sarah Johnson",
      projectType: "Kitchen Remodeling",
      status: "in-progress",
      progress: 35,
      nextMilestone: "Cabinet Installation",
      nextPayment: "$15,000",
      dueDate: "2025-06-15",
      totalAmount: "$75,000",
      isApproved: true,
      tasks: [
        {
          id: "task-1",
          title: "Initial Design & Planning",
          status: "completed",
          startDate: "2025-05-01",
          dueDate: "2025-05-15",
          completedDate: "2025-05-12",
          paymentAmount: 5000,
          paymentStatus: "approved"
        },
        {
          id: "task-2",
          title: "Demolition & Removal",
          status: "completed",
          startDate: "2025-05-16",
          dueDate: "2025-05-30",
          completedDate: "2025-05-28",
          paymentAmount: 7500,
          paymentStatus: "approved"
        },
        {
          id: "task-3",
          title: "Cabinet Installation",
          status: "in-progress",
          startDate: "2025-06-01",
          dueDate: "2025-06-15",
          paymentAmount: 15000,
          paymentStatus: "pending"
        }
      ],
      stakeholders: [
        {
          id: "s1",
          name: "Sarah Johnson",
          role: "Customer",
          email: "sarah@example.com",
          phone: "(555) 123-4567"
        },
        {
          id: "s2",
          name: "John Smith",
          role: "Project Manager",
          email: "john@example.com",
          phone: "(555) 234-5678"
        }
      ],
      documents: [
        {
          id: "d1",
          name: "Project Contract",
          type: "contract",
          date: "2025-05-01",
          url: "#"
        },
        {
          id: "d2",
          name: "Initial Design Plans",
          type: "design",
          date: "2025-05-05",
          url: "#"
        }
      ]
    },
    {
      id: 2,
      name: "Davis Bathroom Remodel",
      customerName: "Emma Davis",
      projectType: "Bathroom Renovation",
      status: "in-progress",
      progress: 25,
      nextMilestone: "Plumbing Rough-In",
      nextPayment: "$10,000",
      dueDate: "2025-06-30",
      totalAmount: "$45,000",
      isApproved: true,
      tasks: [
        {
          id: "task-1",
          title: "Design Approval",
          status: "completed",
          startDate: "2025-05-15",
          dueDate: "2025-05-20",
          completedDate: "2025-05-19",
          paymentAmount: 5000,
          paymentStatus: "approved"
        },
        {
          id: "task-2",
          title: "Plumbing Rough-In",
          status: "in-progress",
          startDate: "2025-06-01",
          dueDate: "2025-06-05",
          paymentAmount: 10000,
          paymentStatus: "pending"
        }
      ],
      stakeholders: [
        {
          id: "s1",
          name: "Emma Davis",
          role: "Customer",
          email: "emma@example.com",
          phone: "(555) 345-6789"
        }
      ],
      documents: [
        {
          id: "d1",
          name: "Bathroom Design Plans",
          type: "design",
          date: "2025-05-10",
          url: "#"
        }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {selectedProject ? (
        <ProjectManagement 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-800">Active Projects</h2>
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.map(project => (
              <div 
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Customer: {project.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{project.totalAmount}</p>
                      <p className="text-sm text-gray-500 mt-1">Total Amount</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Project Progress</span>
                      <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Next Milestone</p>
                      <p className="text-sm font-medium text-gray-900">{project.nextMilestone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="text-sm font-medium text-gray-900">{project.nextPayment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(project.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Manage Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};