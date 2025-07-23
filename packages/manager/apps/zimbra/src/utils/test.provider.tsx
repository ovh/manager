import React, { ComponentType } from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { RenderOptions, RenderResult, render as reactRender } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import accountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import accountFormTranslation from '@/public/translations/accounts/form/Messages_fr_FR.json';
import accountOrderTranslation from '@/public/translations/accounts/order/Messages_fr_FR.json';
import autoRepliesTranslation from '@/public/translations/auto-replies/Messages_fr_FR.json';
import autoRepliesFormTranslation from '@/public/translations/auto-replies/form/Messages_fr_FR.json';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import domainsTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import domainsDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';
import domainsFormTranslation from '@/public/translations/domains/form/Messages_fr_FR.json';
import mailingListsTranslation from '@/public/translations/mailing-lists/Messages_fr_FR.json';
import mailingListsFormTranslation from '@/public/translations/mailing-lists/form/Messages_fr_FR.json';
import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import organizationsFormTranslation from '@/public/translations/organizations/form/Messages_fr_FR.json';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

await i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      common: commonTranslation,
      dashboard: dashboardTranslation,
      organizations: organizationsTranslation,
      'organizations/form': organizationsFormTranslation,
      domains: domainsTranslation,
      'domains/form': domainsFormTranslation,
      'domains/diagnostic': domainsDiagnosticTranslation,
      accounts: accountTranslation,
      'accounts/form': accountFormTranslation,
      'accounts/alias': accountAliasTranslation,
      'accounts/order': accountOrderTranslation,
      'mailing-lists': mailingListsTranslation,
      'mailing-lists/form': mailingListsFormTranslation,
      redirections: redirectionsTranslation,
      'auto-replies': autoRepliesTranslation,
      'auto-replies/form': autoRepliesFormTranslation,
      onboarding: onboardingTranslation,
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

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => reactRender(ui, { wrapper: wrapperWithI18n as ComponentType, ...options });

// We should look into using that
// https://testing-library.com/docs/user-event/intro
export function setup(jsx: React.ReactElement): RenderResult & { user: UserEvent } {
  return {
    user: userEvent.setup(),
    ...customRender(jsx),
  };
}
export * from '@testing-library/react';
export { setup as render };
