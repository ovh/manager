import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CommunicationsDetailPage from './CommunicationsDetail.page';

const mockedNotification = vi.hoisted(() => ({
  id: '610660a7-3a5d-4725-9c20-8a106a383394',
  title: 'Title',
  categories: ['category1', 'category2'],
  priority: 'priority1',
  attachments: [],
  text: 'Text',
  html: 'Html',
  createdAt: '2025-01-01T00:00:00.000Z',
  contacts: [
    {
      type: 'EMAIL',
      to: 'test@example.com',
    },
  ],
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFormatDate: vi.fn().mockReturnValue(() => '2025-01-01'),
  RedirectionGuard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useParams: vi.fn().mockReturnValue({
    notificationId: mockedNotification.id,
  }),
}));

vi.mock('@/hooks', async (original) => ({
  ...(await original()),
  useAuthorization: vi.fn().mockReturnValue({
    isAuthorized: true,
    data: {},
  }),
  useHelpLink: vi.fn().mockReturnValue('https://help.ovhcloud.com/csm'),
}));

vi.mock('@/components', async (original) => ({
  ...(await original()),
  AuthLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ClickLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ContactHistory: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  EmailDisplay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/data', () => ({
  useNotification: vi.fn().mockReturnValue({
    data: mockedNotification,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey || 'translated-text',
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('communications.detail.page', () => {
  it('displays the correct categories', () => {
    const { getByTestId } = render(<CommunicationsDetailPage />, { wrapper });
    expect(getByTestId('notification-categories')).toBeInTheDocument();
    expect(getByTestId('notification-categories')).toHaveTextContent(
      'category_category1, category_category2',
    );
  });
});
