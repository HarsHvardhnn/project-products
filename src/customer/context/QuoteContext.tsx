import React, { createContext, useContext, useEffect } from 'react';
import { useProducts } from './ProductContext';

// Define quote item interfaces
export interface QuoteProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

export interface QuoteMaterial {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Define the quote interface
export interface Quote {
  quoteNumber: string;
  date: string;
  products: QuoteProduct[];
  materials: QuoteMaterial[];
  labor: number;
  notes?: string;
}

// Define the quote context interface
interface QuoteContextType {
  quote: Quote;
  updateQuote: (updates: Partial<Quote>) => void;
  addProduct: (product: QuoteProduct) => void;
  removeProduct: (id: string) => void;
  addMaterial: (material: QuoteMaterial) => void;
  removeMaterial: (id: string) => void;
  updateLabor: (amount: number) => void;
}

// Create the context with default values
const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

// Provider component
export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get products and selected products from ProductContext
  const { products, selectedProducts } = useProducts();

  // Sample materials and labor data
  const materials = [
    {
      id: 'qm-1',
      name: 'Plumbing Fixtures',
      description: 'Sink, faucet, and associated plumbing components',
      price: 850
    },
    {
      id: 'qm-2',
      name: 'Electrical Components',
      description: 'Wiring, outlets, switches, and lighting fixtures',
      price: 1200
    },
    {
      id: 'qm-3',
      name: 'Hardware & Fasteners',
      description: 'Cabinet handles, drawer pulls, and mounting hardware',
      price: 450
    },
    {
      id: 'qm-4',
      name: 'Paint & Finishes',
      description: 'Wall paint, trim paint, and cabinet finishes',
      price: 350
    },
    {
      id: 'qm-5',
      name: 'Miscellaneous Materials',
      description: 'Adhesives, sealants, and other consumables',
      price: 300
    }
  ];

  // Initialize quote state with selected products
  const [quote, setQuote] = React.useState<Quote>({
    quoteNumber: 'Q-2025-001',
    date: 'June 8, 2025',
    products: [],
    materials,
    labor: 18500,
    notes: 'This quote is valid for 30 days from the date issued. Any changes to product selections may affect the final price. Labor costs include demolition, installation, and cleanup.'
  });

  // Update quote products when selected products change
  useEffect(() => {
    const selectedQuoteProducts = products
      .filter(product => selectedProducts.includes(product.id))
      .map(product => ({
        id: product.id,
        name: product.name,
        // brand: product.brand,
        category: product.category,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1
      }));

    setQuote(prevQuote => ({
      ...prevQuote,
      products: selectedQuoteProducts
    }));
  }, [products, selectedProducts]);

  const updateQuote = (updates: Partial<Quote>) => {
    setQuote(prevQuote => ({ ...prevQuote, ...updates }));
  };

  const addProduct = (product: QuoteProduct) => {
    setQuote(prevQuote => ({
      ...prevQuote,
      products: [...prevQuote.products, product]
    }));
  };

  const removeProduct = (id: string) => {
    setQuote(prevQuote => ({
      ...prevQuote,
      products: prevQuote.products.filter(product => product.id !== id)
    }));
  };

  const addMaterial = (material: QuoteMaterial) => {
    setQuote(prevQuote => ({
      ...prevQuote,
      materials: [...prevQuote.materials, material]
    }));
  };

  const removeMaterial = (id: string) => {
    setQuote(prevQuote => ({
      ...prevQuote,
      materials: prevQuote.materials.filter(material => material.id !== id)
    }));
  };

  const updateLabor = (amount: number) => {
    setQuote(prevQuote => ({
      ...prevQuote,
      labor: amount
    }));
  };

  const value = {
    quote,
    updateQuote,
    addProduct,
    removeProduct,
    addMaterial,
    removeMaterial,
    updateLabor
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};

// Custom hook to use the quote context
export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};