import React, { useState } from 'react';
import { Clock, FileText, MessageSquare, AlertCircle, CheckCircle, ChevronLeft, FileText as FileIcon, Users, Plus, DollarSign, Building2, Shield, Tag, Handshake as HandShake } from 'lucide-react';

interface OverviewPanelProps {
  onCreateMeeting: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ onCreateMeeting }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={onCreateMeeting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Instant Meeting
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">Today</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Active Leads</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">12</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">This Week</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">8</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">Unread</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">New Messages</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">5</p>
        </div>
      </div>

      {/* Two Column Layout for Recent Activity and Marketing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Lead Generated</p>
                  <p className="text-sm text-gray-500">Kitchen Remodel Consultation completed with Sarah Johnson</p>
                  <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Update</p>
                  <p className="text-sm text-gray-500">Bathroom renovation milestone completed - Ready for inspection</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Message</p>
                  <p className="text-sm text-gray-500">Michael Chen sent you a message about cabinet selection</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Panel */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Business Growth Tools</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors group">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">Project Financing</h3>
                  <p className="text-sm text-gray-600">Get funding for your upcoming projects</p>
                </div>
              </button>

              <button className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors group">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">Insurance Solutions</h3>
                  <p className="text-sm text-gray-600">Lower your company insurance rates</p>
                </div>
              </button>

              <button className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors group">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">Material Deals</h3>
                  <p className="text-sm text-gray-600">Exclusive discounts from top suppliers</p>
                </div>
              </button>

              <button className="w-full flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-colors group">
                <div className="p-3 bg-amber-100 rounded-lg mr-4">
                  <HandShake className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-gray-900">Quality Subcontractors</h3>
                  <p className="text-sm text-gray-600">Connect with verified subs in your area</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};