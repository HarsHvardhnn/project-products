import React, { useEffect, useRef, useState } from 'react';
import { Camera, ChevronRight, Link, Mic, MicOff, Share, Upload, Users, Video, VideoOff, RotateCcw, X, ChevronLeft, ChevronUp, ChevronDown, Trash2, MessageSquare } from 'lucide-react';
import { GlassmorphicButton } from '../components/GlassmorphicButton';
import { MeetingSummary } from '../components/MeetingSummary';
import { SubmissionComplete } from '../components/SubmissionComplete';
import { MeetingHeader } from '../components/MeetingHeader';
import { QwilloAIChat } from '../components/QwilloAIChat';
import { QwilloLogo } from '../components/QwilloLogo';
import { ParticipantsPanel } from '../components/ParticipantsPanel';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: number;
  name: string;
}

interface Topic {
  id: number;
  title: string;
  details: string[];
  completed?: boolean;
  notes?: string;
}

const kitchenTopics: Topic[] = [
  { id: 1, title: 'Current Kitchen Layout', details: ['Dimensions', 'Current pain points', 'Storage needs'] },
  { id: 2, title: 'Design Preferences', details: ['Style (modern, traditional, etc.)', 'Color scheme', 'Cabinet style'] },
  { id: 3, title: 'Appliances', details: ['What needs replacing', 'Preferred brands', 'Special requirements'] },
  { id: 4, title: 'Countertops', details: ['Material preferences', 'Color preferences', 'Usage patterns'] },
  { id: 5, title: 'Lighting', details: ['Current issues', 'Desired ambiance', 'Special requirements'] },
  { id: 6, title: 'Plumbing', details: ['Sink preferences', 'Faucet style', 'Water filtration needs'] },
  { id: 7, title: 'Storage Solutions', details: ['Pantry requirements', 'Organizational needs', 'Specialty storage'] },
  { id: 8, title: 'Timeline & Budget', details: ['Start date preferences', 'Completion timeline', 'Budget range'] },
  { id: 9, title: 'Additional Features', details: ['Island requirements', 'Specialty areas', 'Smart features'] },
  { id: 10, title: 'Permits & HOA', details: ['Known restrictions', 'Required approvals', 'Timeline impact'] }
];

export const MeetingRoom: React.FC = () => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants] = useState<Participant[]>([
    { id: '1', name: 'John Doe', isHost: true, audioEnabled: true, videoEnabled: false },
    { id: '2', name: 'Jane Smith', isHost: false, audioEnabled: true, videoEnabled: true },
  ]);
  const [timeLeft] = useState(300);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>(kitchenTopics);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showMediaPreview, setShowMediaPreview] = useState<MediaItem | null>(null);
  const [isCameraFlipped, setIsCameraFlipped] = useState(false);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [showMediaStrip, setShowMediaStrip] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showSubmissionComplete, setShowSubmissionComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contractorVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStripRef = useRef<HTMLDivElement>(null);
  const mediaPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMediaStrip && mediaStripRef.current && !mediaStripRef.current.contains(event.target as Node)) {
        setShowMediaStrip(false);
      }
      
      if (showMediaPanel && mediaPanelRef.current && !mediaPanelRef.current.contains(event.target as Node)) {
        setShowMediaPanel(false);
      }
      
      if (showMediaPreview && event.target === event.currentTarget) {
        setShowMediaPreview(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMediaStrip, showMediaPanel, showMediaPreview]);

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleScreenshot = async () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      
      const screenshot = canvas.toDataURL('image/jpeg');
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: 'photo',
        url: screenshot,
        timestamp: Date.now(),
        name: `Screenshot ${new Date().toLocaleTimeString()}`
      };
      
      setMediaItems(prev => [newMediaItem, ...prev]);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        url: e.target?.result as string,
        timestamp: Date.now(),
        name: file.name
      };
      setMediaItems(prev => [newMediaItem, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(null);
    if (showMediaPreview?.id === id) {
      setShowMediaPreview(null);
    }
  };

  const handleTopicComplete = (topicId: number, completed: boolean) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, completed } : topic
    ));
  };

  const handleTopicNote = (topicId: number, note: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId ? { ...topic, notes: note } : topic
    ));
  };

  const handleNextMedia = () => {
    if (mediaItems.length === 0) return;
    setSelectedMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevMedia = () => {
    if (mediaItems.length === 0) return;
    setSelectedMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleToggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (showAIChat) setShowAIChat(false);
  };

  const handleToggleAIChat = () => {
    setShowAIChat(!showAIChat);
    if (showParticipants) setShowParticipants(false);
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <MeetingHeader companyName="J9 Construction, LLC" timeLeft={timeLeft} />

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Video/Audio Area */}
          <div className="flex-1 glassmorphic rounded-xl relative overflow-hidden min-h-0" style={{ height: 'calc(100vh - 264px)' }}>
            {/* Customer's Video/Avatar */}
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ transform: isCameraFlipped ? 'scaleX(-1)' : 'none' }}
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-3xl mx-auto mb-4">
                    {getInitials(participants[0].name)}
                  </div>
                  <p className="text-white">{participants[0].name}</p>
                </div>
              </div>
            )}

            {/* Contractor's Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-48 h-32 rounded-lg overflow-hidden glassmorphic border border-white/20 shadow-lg">
              {participants[1].videoEnabled ? (
                <video
                  ref={contractorVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/30">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-lg mx-auto mb-2">
                      {getInitials(participants[1].name)}
                    </div>
                    <p className="text-white text-sm">{participants[1].name}</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                {participants[1].audioEnabled ? (
                  <Mic className="w-4 h-4 text-white" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>

            {/* Floating Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleScreenshot}
                className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                title="Take Screenshot"
              >
                <Camera className="w-5 h-5" />
              </button>
              {isVideoEnabled && (
                <button
                  onClick={() => setIsCameraFlipped(!isCameraFlipped)}
                  className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
                  title="Flip Camera"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="h-16 glassmorphic rounded-xl flex items-center justify-center space-x-4 relative">
            {/* Media Strip */}
            {showMediaStrip && mediaItems.length > 0 && (
              <div 
                ref={mediaStripRef}
                className="absolute -top-32 left-0 right-0 h-32 glassmorphic rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setShowMediaStrip(false)}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-b-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div className="h-full flex items-center">
                  <button
                    onClick={handlePrevMedia}
                    className="p-2 m-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    disabled={mediaItems.length <= 1}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex-1 h-full flex items-center justify-center">
                    {mediaItems[selectedMediaIndex]?.type === 'photo' ? (
                      <img
                        src={mediaItems[selectedMediaIndex].url}
                        alt={mediaItems[selectedMediaIndex].name}
                        className="max-h-full w-auto object-contain"
                      />
                    ) : (
                      <video
                        src={mediaItems[selectedMediaIndex].url}
                        controls
                        className="max-h-full w-auto object-contain"
                      />
                    )}
                  </div>

                  <button
                    onClick={handleNextMedia}
                    className="p-2 m-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    disabled={mediaItems.length <= 1}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-3 rounded-lg transition-colors ${
                isAudioEnabled ? 'bg-blue-400/20 text-white' : 'bg-red-400/20 text-red-400'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-3 rounded-lg transition-colors ${
                isVideoEnabled ? 'bg-blue-400/20 text-white' : 'bg-white/10 text-gray-400'
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button
              onClick={handleToggleParticipants}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Users className="w-6 h-6" />
            </button>
            <button
              onClick={handleToggleAIChat}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <div className="w-6 h-6">
                <QwilloLogo variant="icon" />
              </div>
            </button>
            <GlassmorphicButton
              variant="primary"
              onClick={() => setShowSummary(true)}
              className="px-6"
            >
              Generate Summary
            </GlassmorphicButton>
          </div>
        </div>

        {/* Right Panel - Topics & Tools */}
        <div className="w-80 flex flex-col gap-4">
          {/* Topics List */}
          <div className="glassmorphic rounded-xl p-4 flex flex-col" style={{ height: 'calc(100vh - 264px)' }}>
            <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
              <span>Kitchen Remodel Topics</span>
              <span className="text-sm text-gray-400">
                {topics.filter(t => t.completed).length}/{topics.length} Complete
              </span>
            </h3>
            <div className="overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div key={topic.id} className="transition-all duration-200">
                    <button
                      onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        expandedTopic === topic.id ? 'bg-blue-400/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
                        topic.completed ? 'bg-green-400/20' : 'bg-white/10'
                      }`}>
                        {topic.completed ? '✓' : topic.id}
                      </div>
                      <span className="text-gray-300 text-left flex-grow">{topic.title}</span>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedTopic === topic.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                    {expandedTopic === topic.id && (
                      <div className="ml-9 py-2 space-y-2">
                        {topic.details.map((detail, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-400 p-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                            <span>{detail}</span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <textarea
                            placeholder="Add notes..."
                            value={topic.notes || ''}
                            onChange={(e) => handleTopicNote(topic.id, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            rows={3}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <button
                              onClick={() => handleTopicComplete(topic.id, !topic.completed)}
                              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                                topic.completed
                                  ? 'bg-green-400/20 text-green-400'
                                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
                              }`}
                            >
                              {topic.completed ? 'Completed' : 'Mark Complete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Media Tools */}
          <div className="h-16 glassmorphic rounded-xl flex items-center justify-center px-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex flex-col items-center justify-center"
              >
                <Upload className="w-4 h-4 mb-0.5" />
                <span className="text-xs">Upload</span>
              </button>
              <button
                onClick={() => {
                  if (mediaItems.length > 0) {
                    setShowMediaStrip(true);
                  } else {
                    setShowMediaPanel(true);
                  }
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex flex-col items-center justify-center"
              >
                {mediaItems.length === 0 ? (
                  <>
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span className="text-xs">Media</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mb-0.5" />
                    <span className="text-xs">View Media</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Media Panel */}
        {showMediaPanel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" />
            <div 
              ref={mediaPanelRef}
              className="relative w-full max-w-4xl glassmorphic rounded-xl p-6"
            >
              <button
                onClick={() => setShowMediaPanel(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h3 className="text-xl font-semibold text-white mb-6">Media Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer relative group"
                    onClick={() => setShowMediaPreview(item)}
                  >
                    {item.type === 'photo' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMediaPreview(item);
                        }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Link className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(item.id);
                        }}
                        className="p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Preview Modal */}
        {showMediaPreview && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowMediaPreview(null);
              }
            }}
          >
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button
                  onClick={() => setShowDeleteConfirm(showMediaPreview.id)}
                  className="p-2 bg-red-400/20 hover:bg-red-400/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
                <button
                  onClick={() => setShowMediaPreview(null)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {showMediaPreview.type === 'photo' ? (
                <img
                  src={showMediaPreview.url}
                  alt={showMediaPreview.name}
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  style={{ margin: 'auto' }}
                />
              ) : (
                <video
                  src={showMediaPreview.url}
                  controls
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  style={{ margin: 'auto' }}
                />
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowDeleteConfirm(null)} />
            <div className="relative glassmorphic rounded-xl p-6 max-w-md w-full text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Delete Media?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this media? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <GlassmorphicButton
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </GlassmorphicButton>
                <GlassmorphicButton
                  variant="primary"
                  className="!bg-red-400/20 hover:!bg-red-400/30 !border-red-400/30"
                  onClick={() => handleDeleteMedia(showDeleteConfirm)}
                >
                  Delete
                </GlassmorphicButton>
              </div>
            </div>
          </div>
        )}

        {/* Participants Panel */}
        <ParticipantsPanel
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
          participants={participants}
        />

        {/* Meeting Summary */}
        {showSummary && (
          <MeetingSummary
            topics={topics}
            mediaItems={mediaItems}
            onClose={() => setShowSummary(false)}
            onSubmit={() => {
              setShowSummary(false);
              setShowSubmissionComplete(true);
            }}
          />
        )}

        {/* Submission Complete */}
        {showSubmissionComplete && (
          <SubmissionComplete
            onExit={() => {
              window.location.href = '/';
            }}
          />
        )}

        {/* AI Chat */}
        <QwilloAIChat
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
        />
      </div>
    </div>
  );
};