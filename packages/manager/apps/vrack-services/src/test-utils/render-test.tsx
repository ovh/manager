import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { TestApp } from './TestApp';

export const RenderTest = ({
  initialRoute,
  shellContext,
  i18nState,
}: {
  initialRoute?: string;
  shellContext: ShellContextType;
  i18nState: i18n;
}) => (
  <I18nextProvider i18n={i18nState}>
    <ShellContext.Provider value={shellContext}>
      <TestApp initialRoute={initialRoute} />
    </ShellContext.Provider>
  </I18nextProvider>
);
