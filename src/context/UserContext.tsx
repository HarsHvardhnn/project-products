import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  customerName: string;
  setCustomerName: (name: string) => void;
  contractorName: string;
  setContractorName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('children in user pprovider',children)
  const [customerName, setCustomerName] = useState('');
  const [contractorName, setContractorName] = useState('J9 Construction, LLC');

  return (
    <UserContext.Provider value={{
      customerName,
      setCustomerName,
      contractorName,
      setContractorName
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};