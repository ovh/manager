import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import BuyCreditPage from './BuyCreditPage';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '123' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('@ovhcloud/manager-components', () => ({
  useNotifications: () => ({
    addError: vi.fn(),
    addSuccess: vi.fn(),
  }),
}));

const shellContext = {
  environment: {
    getUser: vi.fn().mockReturnValue({
      ovhSubsidiary: 'foo',
      currency: {
        symbol: '€',
      },
    }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('BuyCreditPage', () => {
  it('renders BuyCreditModal with correct props', () => {
    const { getByTestId } = render(<BuyCreditPage />, { wrapper });

    expect(getByTestId('BuyCreditPage-modal')).toBeInTheDocument();
  });
});
