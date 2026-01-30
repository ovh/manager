import React, { ComponentType } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import domainTranslation from '@/public/translations/domain/Messages_fr_FR.json';
import allDomaTranslation from '@/public/translations/allDom/Messages_fr_FR.json';
import zoneTranslation from '@/public/translations/zone/Messages_fr_FR.json';
import {
  render,
  renderHook,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});
i18n
  .use(initReactI18next)
  .init({
    lng: 'fr',
    fallbackLng: 'fr',
    resources: {
      fr: {
        domain: domainTranslation,
        alldoms: allDomaTranslation,
        zone: zoneTranslation,
      },
    },
    ns: ['alldoms', 'domain', 'zone'],
  })
  .catch(console.error);
export const mockShellContext = ({
  environment: {
    user: {
      ovhSubsidiary: 'FR',
    },
    getUser: () => ({ ovhSubsidiary: 'FR' }),
    getUserLocale: () => ({}),
    getRegion: () => 'EU',
  },
  shell: {
    navigation: {
      getURL: (_: unknown, path: string): Promise<string> => {
        return new Promise<string>((resolve) => {
          return resolve(`https://ovh.test/#${path}`);
        });
      },
    },
  },
} as unknown) as ShellContextType;

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider value={mockShellContext}>
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
        <ShellContext.Provider value={mockShellContext}>
          <MemoryRouter>{children}</MemoryRouter>
        </ShellContext.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

const customRenderHook = (
  props: (initialsProps: unknown) => unknown,
  options?: RenderOptions,
) => renderHook(props, { wrapper: wrapper as ComponentType, ...options });

const customRender = (
  jsx: React.ReactNode,
  options?: RenderOptions,
): RenderResult =>
  render(jsx, { wrapper: wrapperWithI18n as ComponentType, ...options });

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
