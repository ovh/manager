import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import dashboardTranslation from '@translation/dashboard/Messages_fr_FR.json';
import onboardingTranslation from '@translation/onboarding/Messages_fr_FR.json';
import listingTranslation from '@translation/listing/Messages_fr_FR.json';
import updateSoftwareTranslation from '@translation/updateSoftware/Messages_fr_FR.json';
import orderPriceTranslation from '@translation/order-price/Messages_fr_FR.json';
import queryClient from '@/queryClient';

const ns = ['onboarding', 'listing', 'dashboard', 'updateSoftware'];

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      dashboard: dashboardTranslation,
      onboarding: onboardingTranslation,
      listing: listingTranslation,
      updateSoftware: updateSoftwareTranslation,
      'order-price': orderPriceTranslation,
    },
  },
  fallbackNS: ns,
  ns,
});

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
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
