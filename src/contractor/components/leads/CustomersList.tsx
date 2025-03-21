import React, { useState } from 'react';
import { Star, MessageSquare, Calendar, Phone, Mail, MapPin, Video, Plus, ChevronRight } from 'lucide-react';
import { MeetingScheduler } from './MeetingScheduler';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectHistory: Array<{
    id: number;
    type: string;
    date: string;
    amount: string;
  }>;
  rating?: number;
  notes?: string;
  status: 'active' | 'past' | 'favorite';
  avatar?: string;
}

interface CustomersListProps {
  searchTerm: string;
  statusFilter: string;
}

export const CustomersList: React.FC<CustomersListProps> = ({ searchTerm, statusFilter }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [isInstantMeeting, setIsInstantMeeting] = useState(false);

  // Sample customers data
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Portland, OR 97201',
      projectHistory: [
        { id: 1, type: 'Kitchen Remodel', date: '2024-12-15', amount: '$45,000' },
        { id: 2, type: 'Bathroom Renovation', date: '2023-08-20', amount: '$25,000' }
      ],
      rating: 5,
      notes: 'Excellent client, very detailed oriented',
      status: 'favorite',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Portland, OR 97202',
      projectHistory: [
        { id: 3, type: 'Home Addition', date: '2024-02-10', amount: '$85,000' }
      ],
      rating: 4,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    }
  ]);

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.projectHistory.some(project => 
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateMeeting = (customerId: number, instant: boolean) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setShowMeetingScheduler(true);
      setIsInstantMeeting(instant);
    }
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {filteredCustomers.length} Customers
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}

                {/* Customer Info */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                    {customer.rating && (
                      <div className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{customer.rating}</span>
                      </div>
                    )}
                    {customer.status === 'favorite' && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Favorite Client
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {customer.address}
                    </div>
                  </div>

                  {/* Project History */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Project History</h4>
                    <div className="space-y-2">
                      {customer.projectHistory.map(project => (
                        <div key={project.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{project.type}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">{new Date(project.date).toLocaleDateString()}</span>
                            <span className="font-medium text-gray-900">{project.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleCreateMeeting(customer.id, true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Instant Meeting
                </button>
                <button
                  onClick={() => handleCreateMeeting(customer.id, false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </button>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No customers found matching your criteria.
          </div>
        )}
      </div>

      {/* Meeting Scheduler Modal */}
      {selectedCustomer && (
        <MeetingScheduler
          isOpen={showMeetingScheduler}
          onClose={() => {
            setShowMeetingScheduler(false);
            setSelectedCustomer(null);
          }}
          contactName={selectedCustomer.name}
          contactEmail={selectedCustomer.email}
          contactPhone={selectedCustomer.phone}
          isInstantMeeting={isInstantMeeting}
        />
      )}
    </div>
  );
};