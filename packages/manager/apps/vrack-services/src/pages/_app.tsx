import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('vrack-services:crumb');
}

const App: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useTranslation('vrack-services');

  return <>{children}</>;
};

export default App;
