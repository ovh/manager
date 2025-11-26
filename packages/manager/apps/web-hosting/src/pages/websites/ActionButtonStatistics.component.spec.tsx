import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import ActionButtonStatistics from './ActionButtonStatistics.component';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('ActionButtonStatistics component', () => {
  it('should render', () => {
    const { container } = render(<ActionButtonStatistics webSiteItem={websitesMocks[0]} />, {
      wrapper: Wrappers as ComponentType,
    });
    expect(container).toBeInTheDocument();
    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(1);
    expect(menuItems[0]).toHaveAttribute(
      'label',
      commonTranslation.web_hosting_dashboard_action_statistics,
    );
  });
});
