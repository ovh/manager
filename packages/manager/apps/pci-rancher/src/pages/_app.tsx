import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('pci-rancher:crumb');
}

export default function App({ children }: { children: React.ReactNode }) {
  useTranslation('pci-rancher');

  return <>{children}</>;
}
