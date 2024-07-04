import React from 'react';
import { useTranslation } from 'react-i18next';

export default function App({ children }: { children: React.ReactNode }) {
  useTranslation('pci-ai-notebooks');

  return <>{children}</>;
}
