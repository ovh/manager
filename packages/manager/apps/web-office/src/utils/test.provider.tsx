import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import userEvent from '@testing-library/user-event';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import dashboardUsersTranslation from '@/public/translations/dashboard/users/Messages_fr_FR.json';
import licensesTranslation from '@/public/translations/licenses/Messages_fr_FR.json';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      dashboard: dashboardTranslation,
      licenses: licensesTranslation,
      'dashboard/users': dashboardUsersTranslation,
    },
  },
  ns: ['dashboard'],
});

export const getShellContext = () => {
  return {
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
      getRegion: () => 'EU',
      getUserLocale: () => 'fr_FR',
    },
    shell: {
      routing: {
        onHashChange: () => undefined,
        stopListenForHashChange: () => undefined,
        listenForHashChange: () => undefined,
      },
    },
  } as ShellContextType;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={getShellContext()}>
        <MemoryRouter>{children}</MemoryRouter>
      </ShellContext.Provider>
    </QueryClientProvider>
  );
};

export const wrapperWithI18n = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ShellContext.Provider value={getShellContext()}>
          <MemoryRouter>{children}</MemoryRouter>
        </ShellContext.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: wrapperWithI18n as ComponentType, ...options });

// We should look into using that
// https://testing-library.com/docs/user-event/intro
export function setup(jsx: React.ReactElement): unknown {
  return {
    user: userEvent.setup(),
    ...customRender(jsx),
  };
}
export * from '@testing-library/react';
export { setup as render };
