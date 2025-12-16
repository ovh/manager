import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { MessageContextProvider } from '../components/feedback-messages/Messages.context';

export const RenderTestComponent = ({
  component,
  shellContext,
  i18nState,
  queryClient,
}: {
  component: React.JSX.Element;
  shellContext: ShellContextType;
  i18nState: i18n;
  queryClient: QueryClient;
}) => (
  <I18nextProvider i18n={i18nState}>
    <ShellContext.Provider value={shellContext}>
      <QueryClientProvider client={queryClient}>
        <MessageContextProvider>{component}</MessageContextProvider>
      </QueryClientProvider>
    </ShellContext.Provider>
  </I18nextProvider>
);
