import React, { Suspense, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { Preview } from '@storybook/react';
import './storybook.css';
import '../../manager-ui-kit/src/lib.scss';
import '@ovhcloud/ods-themes/default';

import i18n from './i18n';
import TechnicalInformation from './technical-information.mdx';
import { normalizeLanguageCode } from '../../manager-ui-kit/src/utils/translation-helper';
import { handlers } from './msw-handlers';

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Do not retry on failure
      staleTime: Infinity, // Data does not become stale
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  beforeAll: async () => {
    initialize(
      {
        onUnhandledRequest: 'bypass',
      },
      handlers,
    );
  },
  parameters: {
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        disable: false,
      },
      source: {
        excludeDecorators: true,
        state: 'open',
      },
      page: TechnicalInformation,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      hideNoControlsWarning: true,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Manager UI Kit',
          [
            'Introduction',
            "What's new",
            'Guidelines',
            'Changelog',
            'components',
            'Content',
            'Content',
            'Navigation',
            'Templates',
            'Typography',
            'Hooks',
            '*',
          ],
          'Guidelines',
          [
            'React Templates',
            ['Listing page', 'Dashboard page', 'Onboarding page'],
          ],
          'Core',
          ['*', ['Overview', 'Changelog', '*']],
          'Features',
          ['*', ['Overview', 'Changelog', '*']],
        ],
      },
      showPanel: true,
    },
    status: {
      type: 'stable',
    },
    loaders: [mswLoader],
  },
};

const withI18next = (Story, context) => {
  const { locale } = context.globals;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const changeLanguage = async () => {
      try {
        setIsLoading(true);
        await i18n.changeLanguage(locale);

        // Small delay to ensure translations are fully loaded
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Language change failed:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    changeLanguage();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  useEffect(() => {
    const handleBrowserLanguageChange = () => {
      const normalizedLang = normalizeLanguageCode(navigator.language);
      console.info('Browser language changed:', normalizedLang);
      i18n
        .changeLanguage(normalizedLang)
        .catch((err) =>
          console.error(
            'Failed to change language on system languagechange:',
            err,
          ),
        );
    };

    window.addEventListener('languagechange', handleBrowserLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleBrowserLanguageChange);
    };
  }, []);

  if (isLoading) {
    return <div>Loading translations...</div>;
  }

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={mockQueryClient}>
          <Story />
        </QueryClientProvider>
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
    defaultValue: 'fr_FR',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'fr_FR', title: 'Francais' },
        { value: 'en_GB', title: 'English' },
        { value: 'de_DE', title: 'Deutsch' },
        { value: 'es_ES', title: 'Espagne' },
        { value: 'it_IT', title: 'Italy' },
        { value: 'pt_PT', title: 'Portugal' },
        { value: 'pl_PL', title: 'Poland' },
        { value: 'fr_CA', title: 'Canada' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};

export default preview;
