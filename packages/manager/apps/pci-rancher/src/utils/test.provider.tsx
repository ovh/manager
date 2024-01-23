import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import dashboardTranslation from '../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import onboardingTranslation from '../public/translations/pci-rancher/onboarding/Messages_fr_FR.json';
import listingTranslation from '../public/translations/pci-rancher/listing/Messages_fr_FR.json';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({ isLoading: false, data: [] })),
  useMutation: jest.fn(() => ({ isLoading: false, data: [] })),
}));

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      'pci-rancher/dashboard': dashboardTranslation,
      'pci-rancher/onboarding': onboardingTranslation,
      'pci-rancher/listing': listingTranslation,
    },
  },
  ns: ['common'],
});

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export * from '@testing-library/react';

export { customRender as render };
