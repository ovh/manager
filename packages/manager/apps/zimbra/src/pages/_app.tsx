import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('zimbra:crumb');
}

export default function App({ children }: { children: React.ReactNode }) {
  useTranslation('zimbra');

  return <>{children}</>;
}
