import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, File, X, Plus, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { CreateConversationModal } from './CreateConversationModal';

interface Message {
  id: string;
  content: string;
  sender: 'contractor' | 'customer' | 'stakeholder';
  senderName: string;
  senderRole: string;
  timestamp: Date;
  attachments?: {
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: string;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'customer' | 'stakeholder';
    company: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
}

interface Participant {
  id: string;
  name: string;
  role: 'customer' | 'financial' | 'insurance' | 'inspector' | 'realtor' | 'investor';
  company: string;
  avatar?: string;
}

export const ContractorCommunication: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { contractorName } = useProject();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
    size?: string;
  }[]>([]);

  // Get URL parameters for direct conversation opening
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const participantId = searchParams.get('participantId');
    const participantName = searchParams.get('participantName');
    const participantRole = searchParams.get('participantRole');
    const participantCompany = searchParams.get('participantCompany');
    const participantAvatar = searchParams.get('participantAvatar');

    // If we have participant info in the URL, create/open that conversation
    if (participantId && participantName && participantRole && participantCompany) {
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.id === participantId)
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation);
      } else {
        const newConversation: Conversation = {
          id: `c${Date.now()}`,
          participants: [{
            id: participantId,
            name: participantName,
            role: participantRole as 'customer' | 'stakeholder',
            company: participantCompany,
            avatar: participantAvatar || undefined
          }]
        };
        setConversations(prev => [...prev, newConversation]);
        setSelectedConversation(newConversation);
      }

      // Clear URL parameters after handling
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'c1',
      participants: [{
        id: 'customer1',
        name: 'Sarah Johnson',
        role: 'customer',
        company: 'Homeowner',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
      }],
      lastMessage: {
        content: "Thank you for the detailed quote!",
        timestamp: '10:30 AM',
        isRead: false
      }
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateConversation = (participants: Participant[]) => {
    const newConversation: Conversation = {
      id: `c${conversations.length + 1}`,
      participants: participants.map(participant => ({
        id: participant.id,
        name: participant.name,
        role: 'stakeholder',
        company: participant.company,
        avatar: participant.avatar
      }))
    };

    setConversations(prev => [...prev, newConversation]);
  };

  const handleAttachmentClick = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleFileUpload = (type: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
    setShowAttachmentOptions(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const fileSize = formatFileSize(file.size);

      // Create object URL for preview
      const url = URL.createObjectURL(file);

      // Add to pending attachments
      setPendingAttachments(prev => [...prev, {
        id: `upload-${Date.now()}-${file.name}`,
        type: isImage ? 'image' : 'document',
        url,
        name: file.name,
        size: fileSize
      }]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'contractor',
      senderName: contractorName,
      senderRole: 'contractor',
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setPendingAttachments([]); // Clear pending attachments after sending

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message. I'll review it and get back to you shortly.",
        sender: 'customer',
        senderName: selectedConversation.participants[0].name,
        senderRole: selectedConversation.participants[0].role,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {!selectedConversation ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors mb-4"
          >
            <Plus className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Create Conversation</span>
          </button>

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className="flex items-center p-4 bg-gradient-to-r from-blue-600/5 to-blue-600/10 border border-blue-100 rounded-lg hover:from-blue-600/10 hover:to-blue-600/15 transition-all duration-300 cursor-pointer"
            >
              <div className="flex -space-x-2 mr-4">
                {conversation.participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ${
                      index > 2 ? 'hidden' : ''
                    }`}
                  >
                    {participant.avatar ? (
                      <img 
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {conversation.participants.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-xs text-blue-600">
                      +{conversation.participants.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {conversation.participants.map(p => p.name).join(', ')}
                    </h3>
                    <p className="text-xs text-blue-600">
                      {conversation.participants.map(p => p.company).join(', ')}
                    </p>
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage.timestamp}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Conversations
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedConversation.participants.length} Participants
                  </span>
                  {showParticipants ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>

                {showParticipants && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    {selectedConversation.participants.map((participant, index) => (
                      <div 
                        key={participant.id}
                        className={`px-4 py-2 ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <div className="flex items-center">
                          {participant.avatar ? (
                            <img 
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {participant.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                            <p className="text-xs text-gray-500">{participant.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'contractor' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-lg p-4 ${
                  message.sender === 'contractor' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.sender !== 'contractor' && (
                    <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map(attachment => (
                        <div 
                          key={attachment.id}
                          className={`rounded-lg overflow-hidden ${
                            attachment.type === 'image' ? '' : 'p-3 bg-white bg-opacity-10'
                          }`}
                        >
                          {attachment.type === 'image' ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-full h-auto max-h-40 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex items-center">
                              <File className="w-5 h-5 text-gray-400 mr-2" />
                              <div>
                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                {attachment.size && (
                                  <p className="text-xs opacity-75">{attachment.size}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.sender === 'contractor' ? 'text-blue-200' : 'text-gray-500'
                  } text-right`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            {pendingAttachments.length > 0 && (
              <div className="mb-4 space-y-2">
                {pendingAttachments.map(attachment => (
                  <div 
                    key={attachment.id}
                    className="flex items-center bg-gray-50 p-2 rounded-lg"
                  >
                    {attachment.type === 'image' ? (
                      <img 
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <File className="w-10 h-10 text-gray-400" />
                    )}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <button
                      onClick={() => removePendingAttachment(attachment.id)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                <div className="absolute right-2 bottom-2 flex space-x-1">
                  <div className="relative">
                    <button
                      onClick={handleAttachmentClick}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>
                    
                    {showAttachmentOptions && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
                        <button
                          onClick={() => handleFileUpload('image')}
                          className="flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="p-1.5 rounded bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <Image className="w-4 h-4" />
                          </div>
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">Upload Image</span>
                            <span className="block text-xs text-gray-500">PNG, JPG up to 10MB</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleFileUpload('document')}
                          className="flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="p-1.5 rounded bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <File className="w-4 h-4" />
                          </div>
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">Upload Document</span>
                            <span className="block text-xs text-gray-500">PDF, DOC up to 25MB</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && pendingAttachments.length === 0}
                className={`p-2 rounded-full ${
                  newMessage.trim() || pendingAttachments.length > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } transition-colors`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}

      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};