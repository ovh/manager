import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('cdn-react:crumb');
}

export default function App({ children }: { children: React.ReactNode }) {
  useTranslation('cdn-react');

  return <>{children}</>;
}
