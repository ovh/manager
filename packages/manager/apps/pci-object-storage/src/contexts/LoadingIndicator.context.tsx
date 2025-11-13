import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingIndicatorContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingIndicatorContext = createContext<
  LoadingIndicatorContextType | undefined
>(undefined);

interface LoadingIndicatorProviderProps {
  children: ReactNode;
}

export const LoadingIndicatorProvider: React.FC<LoadingIndicatorProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingIndicatorContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingIndicatorContext.Provider>
  );
};

export const useLoadingIndicatorContext = (): LoadingIndicatorContextType => {
  const context = useContext(LoadingIndicatorContext);
  if (context === undefined) {
    throw new Error(
      'useLoadingIndicatorContext must be used within a LoadingIndicatorProvider',
    );
  }
  return context;
};
