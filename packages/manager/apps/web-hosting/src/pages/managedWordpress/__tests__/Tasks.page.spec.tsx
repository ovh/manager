import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import TaskPage from '../ManagedWordpressResource/tasks/Tasks.page';

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

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks',
  () => ({
    useManagedWordpressResourceTasks: vi.fn(() => ({
      data: managedWordpressWebsitesTaskMock,
    })),
  }),
);

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

describe('Task Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<TaskPage />, { wrapper: Wrappers as ComponentType });
    const sortedRowFqdn = getByTestId('header-defaultFqdn');

    expect(sortedRowFqdn).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_fqdn,
    );
  });
});
