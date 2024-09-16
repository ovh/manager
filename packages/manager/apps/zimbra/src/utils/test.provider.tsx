import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import organizationsAddAndEditTranslation from '@/public/translations/organizations/addAndEdit/Messages_fr_FR.json';
import organizationsDeleteTranslation from '@/public/translations/organizations/delete/Messages_fr_FR.json';
import domainsTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import domainsAddDomainTranslation from '@/public/translations/domains/addDomain/Messages_fr_FR.json';
import domainsDeleteTranslation from '@/public/translations/domains/delete/Messages_fr_FR.json';
import domainsDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';
import accountTranslation from '@/public/translations/accounts/Messages_fr_FR.json';
import accountAddAndEditTranslation from '@/public/translations/accounts/addAndEdit/Messages_fr_FR.json';
import accountAliasTranslation from '@/public/translations/accounts/alias/Messages_fr_FR.json';
import accountAliasAddTranslation from '@/public/translations/accounts/alias/add/Messages_fr_FR.json';
import accountAliasDeleteTranslation from '@/public/translations/accounts/alias/delete/Messages_fr_FR.json';
import accountDeleteTranslation from '@/public/translations/accounts/delete/Messages_fr_FR.json';
import mailingListsTranslation from '@/public/translations/mailinglists/Messages_fr_FR.json';
import queryClient from '@/queryClient';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      dashboard: dashboardTranslation,
      organizations: organizationsTranslation,
      'organizations/addAndEdit': organizationsAddAndEditTranslation,
      'organizations/delete': organizationsDeleteTranslation,
      domains: domainsTranslation,
      'domains/addDomain': domainsAddDomainTranslation,
      'domains/delete': domainsDeleteTranslation,
      'domains/diagnostic': domainsDiagnosticTranslation,
      accounts: accountTranslation,
      'accounts/addAndEdit': accountAddAndEditTranslation,
      'accounts/alias': accountAliasTranslation,
      'accounts/alias/add': accountAliasAddTranslation,
      'accounts/alias/delete': accountAliasDeleteTranslation,
      'accounts/delete': accountDeleteTranslation,
      mailinglists: mailingListsTranslation,
    },
  },
  ns: ['dashboard'],
});

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export * from '@testing-library/react';

export { customRender as render };
