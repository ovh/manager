import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import onboardingTranslation from '../../../public/translations/onboarding/Messages_fr_FR.json';
import listingTranslation from '../../../public/translations/listing/Messages_fr_FR.json';
import queryClient from '../../query.client';

const ns = ['pci-savings-plan/onboarding', 'pci-savings-plan/listing'];

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      'pci-savings-plan/onboarding': onboardingTranslation,
      'pci-savings-plan/listing': listingTranslation,
    },
  },
  fallbackNS: ns,
  ns,
});

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n as any}>{children}</I18nextProvider>
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
