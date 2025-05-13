import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Preview } from '@storybook/react';
import './storybook.css';
import '../../manager-react-components/src/lib.scss';
import '@ovhcloud/ods-themes/default';

import i18n from './i18n';
import TechnicalInformation from './technical-information.mdx';

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Do not retry on failure
      staleTime: Infinity, // Data does not become stale
    },
  },
});

const preview: Preview = {
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
          'Core',
          [
            'manager-react-components',
            ['Introduction', "What's new", 'Changelog'],
            '*',
            ['Overview', 'Changelog'],
          ],
          'Features',
          ['*', ['Overview', 'Changelog'], '*'],
        ],
      },
      showPanel: true,
    },
    status: {
      type: 'stable',
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
    },
  },
};

export default preview;
