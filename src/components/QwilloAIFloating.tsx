import React, { useState, useEffect, useRef } from 'react';
import { QwilloLogo } from './QwilloLogo';
import { Send, X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const QwilloAIFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Hi! I'm Qwillo AI. I can help you with your project by providing information from your initial consultation, quote details, and ongoing communications. What would you like to know?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatPanelRef.current && !chatPanelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Based on your initial consultation, I can help you with that. During the meeting, we discussed kitchen layout preferences, appliance choices, and material selections. Would you like me to provide more specific details about any of these topics?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="w-8 h-8">
          <QwilloLogo variant="icon" />
        </div>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className={`fixed right-4 ${
            isMinimized ? 'bottom-4' : 'bottom-4'
          } w-96 bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
            isMinimized ? 'h-14' : 'h-[600px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <QwilloLogo variant="icon" />
              </div>
              <h3 className="text-gray-800 font-medium">Qwillo AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="h-16 border-t border-gray-200 p-2 flex items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your project..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '80px' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`ml-2 p-2 rounded-full ${
                    input.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};