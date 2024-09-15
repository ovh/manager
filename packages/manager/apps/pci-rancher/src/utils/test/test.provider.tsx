import { render } from '@testing-library/react';
import i18n from 'i18next';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import dashboardTranslation from '../../../public/translations/dashboard/Messages_fr_FR.json';
import onboardingTranslation from '../../../public/translations/onboarding/Messages_fr_FR.json';
import listingTranslation from '../../../public/translations/listing/Messages_fr_FR.json';
import updateSoftwareTranslation from '../../../public/translations/updateSoftware/Messages_fr_FR.json';
import queryClient from '../../queryClient';

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
    },
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  fallbackNS: ns,
  ns,
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </QueryClientProvider>,
  );
};

export { renderWithProviders as render };
