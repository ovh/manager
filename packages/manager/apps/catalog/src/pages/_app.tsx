import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('catalog:title');
}

export default function App({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useTranslation('catalog');
  return <>{children}</>;
}
