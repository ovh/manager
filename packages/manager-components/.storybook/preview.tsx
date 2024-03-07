import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import { Preview } from '@storybook/react';
import '../src/tailwind/theme.css';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import i18n from './i18n';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

const withI18next = (Story, context) => {
  const { locale } = context.globals;

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  );
};

// export decorators for storybook to wrap your stories in
export const decorators = [withI18next];

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'fr-FR', title: 'Francais' },
        { value: 'en-GB', title: 'English' },
        { value: 'de-DE', title: 'Deutsch' },
        { value: 'es-ES', title: 'Espagne' },
        { value: 'it-IT', title: 'Italy' },
        { value: 'pt-PT', title: 'Portugal' },
        { value: 'pl-PL', title: 'Poland' },
        { value: 'fr-CA', title: 'Canada' },
      ],
      showName: true,
    },
  },
};

export default preview;
