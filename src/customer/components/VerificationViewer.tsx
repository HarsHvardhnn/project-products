import React, { useState, useEffect } from 'react';
import { X, Download, FileText, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface VerificationViewerProps {
  type: 'photo' | 'video' | 'inspection';
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationViewer: React.FC<VerificationViewerProps> = ({
  type,
  isOpen,
  onClose
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [verificationLink] = useState(`/verifications/${type}/${Date.now()}`); // In a real app, this would be a proper URL

  // Sample data - in a real app this would come from props or an API
  const photos = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0c?auto=format&fit=crop&q=80'
  ];
  
  const inspectionReport = {
    date: '2025-06-10',
    inspector: 'John Smith',
    status: 'Passed',
    notes: 'All work meets required standards and specifications.',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80'
    ]
  };

  useEffect(() => {
    // Clear any existing verification data when component mounts
    localStorage.removeItem('verificationLink');
    localStorage.removeItem('verificationType');
  }, []);

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const handleMessageClick = () => {
    // Store verification data in localStorage
    localStorage.setItem('verificationLink', verificationLink);
    localStorage.setItem('verificationType', type);

    // Get the parent element that contains the messages panel
    const dashboardLayout = document.querySelector('.min-h-screen.bg-gray-50');
    if (!dashboardLayout) return;

    // Find the messages button in the header
    const messagesButton = dashboardLayout.querySelector('button[aria-label="Open Messages"]');
    if (messagesButton instanceof HTMLButtonElement) {
      messagesButton.click();
    }

    // Close the verification viewer
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'photo' ? 'Photo Verification' :
             type === 'video' ? 'Video Verification' :
             'Inspection Report'}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMessageClick}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">Share in Message</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'inspection' && (
            <div className="space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-900">{inspectionReport.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inspector</p>
                  <p className="text-gray-900">{inspectionReport.inspector}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-green-600">Passed</p>
              </div>

              {/* Notes Section */}
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-900">{inspectionReport.notes}</p>
              </div>

              {/* Photos Section */}
              <div>
                <p className="text-sm text-gray-500">Photos</p>
                <div className="relative mt-2">
                  <div className="w-1/2">
                    <img
                      src={inspectionReport.photos[0]}
                      alt="Inspection photo"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-end mt-4">
                <button className="flex items-center px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </button>
              </div>
            </div>
          )}

          {type === 'photo' && (
            <div className="space-y-6">
              <div className="relative">
                <div className="w-1/2 mx-auto relative">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`Verification photo ${currentPhotoIndex + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  
                  {/* Navigation Buttons */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {type === 'video' && (
            <div className="w-1/2 mx-auto aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                poster="https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80"
              >
                <source src="video-url-here.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};