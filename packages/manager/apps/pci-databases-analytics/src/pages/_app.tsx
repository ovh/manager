import React from 'react';
import { useTranslation } from 'react-i18next';

const App = ({ children }: { children: React.ReactNode }) => {
  useTranslation('pci-databases-analytics');

  return <>{children}</>;
};

export default App;
