import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import EditNameModal from '../EditName.modal';

vi.mock('@ovh-ux/muk', () => ({
  UpdateNameModal: ({
    children,
    headline,
    ...props
  }: React.PropsWithChildren<{ headline?: string; [key: string]: unknown }>) => (
    <div data-testid="update-name-modal" {...props}>
      {headline && <div>{headline}</div>}
      {children}
    </div>
  ),
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

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

describe('EditName page', () => {
  it('Page for update', async () => {
    render(<EditNameModal />, { wrapper: Wrappers as ComponentType });
    expect(
      await screen.findByText(dashboardTranslation.hosting_dashboard_modal_update_headline),
    ).toBeVisible();
  });
});
