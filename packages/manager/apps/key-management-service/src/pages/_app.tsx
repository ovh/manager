// TODO: delete this file

import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('key-management-service:crumb');
}

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useTranslation('key-management-service');

  return (
    <div className="m-10">
      <div>should be deleted, is not used anymore</div>
      {children}
    </div>
  );
}
