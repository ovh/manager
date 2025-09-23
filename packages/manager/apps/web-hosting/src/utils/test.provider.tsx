import React, { ComponentType } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { RenderOptions, RenderResult, render, renderHook } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',
    resources: {
      fr: {
        common: commonTranslation,
        onboarding: onboardingTranslation,
      },
    },
    ns: ['common', 'onboarding'],
  })
  .catch(console.error);

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
      ux: {
        hidePreloader: () => undefined,
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

export const wrapperWithI18n = ({ children }: { children: React.ReactNode }) => {
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

const customRender = (jsx: React.ReactNode, options?: RenderOptions): RenderResult =>
  render(jsx, { wrapper: wrapperWithI18n as ComponentType, ...options });

const customRenderHook = (props: (initialsProps: unknown) => unknown, options?: RenderOptions) =>
  renderHook(props, { wrapper: wrapper as ComponentType, ...options });

export function setup(
  jsx: React.ReactElement,
  options?: RenderOptions,
): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...customRender(jsx, options),
  };
}
export * from '@testing-library/react';
export { setup as render, customRenderHook as renderHook };
