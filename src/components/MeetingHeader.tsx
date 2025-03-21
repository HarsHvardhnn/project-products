import React from 'react';
import { QwilloLogo } from './QwilloLogo';
import { Clock } from 'lucide-react';

interface MeetingHeaderProps {
  companyName: string;
  timeLeft: number;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({ companyName, timeLeft }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex gap-4">
      {/* Main Header Section */}
      <div className="flex-1 h-16 glassmorphic rounded-xl flex items-center justify-between px-6 relative">
        {/* Company Name */}
        <div className="text-white font-medium">
          {companyName}
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
          <QwilloLogo variant="icon" />
        </div>

        {/* Spacer to maintain centering */}
        <div className="w-[120px]"></div>
      </div>

      {/* Topics Panel Header Section */}
      <div className="w-80 h-16 glassmorphic rounded-xl flex items-center justify-between px-6">
        <div className="text-gray-400">
          Today | {formatDate()}
        </div>
        <div className="flex items-center text-white">
          <Clock className="w-4 h-4 mr-2 text-blue-400" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};