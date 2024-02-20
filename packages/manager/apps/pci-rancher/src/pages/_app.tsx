import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('pci-rancher:crumb');
}

const App: React.FC<React.PropsWithChildren> = ({ children }) => {
  useTranslation('pci-rancher');

  return <>{children}</>;
};
export default App;
