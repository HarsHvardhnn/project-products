import React, { useState, useRef } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Upload,
  Camera,
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    businessProfile: true,
    contractorProfile: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Business Profile
    businessName: 'J9 Construction, LLC',
    businessEmail: 'info@j9construction.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Main St, Portland, OR 97201',
    businessWebsite: 'www.j9construction.com',
    businessLogo: '',
    
    // Contractor Profile
    firstName: 'Josh',
    lastName: 'Householder',
    email: 'josh@j9construction.com',
    phone: '(555) 987-6543',
    title: 'Owner',
    bio: 'Experienced contractor specializing in high-end residential remodels.',
    profilePicture: ''
  });

  const businessLogoRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<'business' | 'profile' | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e: React.DragEvent, type: 'business' | 'profile') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, type: 'business' | 'profile') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [type === 'business' ? 'businessLogo' : 'profilePicture']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'business' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          [type === 'business' ? 'businessLogo' : 'profilePicture']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    console.log('Saving settings:', formData);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      </div>

      {/* Business Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('businessProfile')}
        >
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-medium text-gray-900">Business Profile</h3>
          </div>
          {expandedSections.businessProfile ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.businessProfile && (
          <div className="p-6 border-t border-gray-200">
            {/* Business Logo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg h-[160px] ${
                  dragActive === 'business' 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={e => handleDrag(e, 'business')}
                onDragLeave={e => handleDrag(e, 'business')}
                onDragOver={e => handleDrag(e, 'business')}
                onDrop={e => handleDrop(e, 'business')}
              >
                <div className="space-y-1 text-center">
                  {formData.businessLogo ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={formData.businessLogo}
                        alt="Business Logo"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, businessLogo: '' }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="business-logo"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={businessLogoRef}
                            id="business-logo"
                            name="business-logo"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={e => handleFileChange(e, 'business')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div>
                <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    id="businessPhone"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Globe className="h-5 w-5" />
                  </span>
                  <input
                    type="url"
                    id="businessWebsite"
                    name="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contractor Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('contractorProfile')}
        >
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-medium text-gray-900">Contractor Profile</h3>
          </div>
          {expandedSections.contractorProfile ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.contractorProfile && (
          <div className="p-6 border-t border-gray-200">
            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg h-[160px] ${
                  dragActive === 'profile' 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={e => handleDrag(e, 'profile')}
                onDragLeave={e => handleDrag(e, 'profile')}
                onDragOver={e => handleDrag(e, 'profile')}
                onDrop={e => handleDrop(e, 'profile')}
              >
                <div className="space-y-1 text-center">
                  {formData.profilePicture ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={formData.profilePicture}
                        alt="Profile Picture"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, profilePicture: '' }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Camera className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="profile-picture"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            ref={profilePictureRef}
                            id="profile-picture"
                            name="profile-picture"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={e => handleFileChange(e, 'profile')}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-none rounded-r-lg h-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg resize-none"
                  placeholder="Tell customers about yourself and your experience..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <div>
          {saveSuccess && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Settings saved successfully</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};