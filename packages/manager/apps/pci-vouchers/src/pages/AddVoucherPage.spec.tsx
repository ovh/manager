import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import AddVoucherPage from './AddVoucherPage';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '123' }),
  useNavigate: () => vi.fn(),
}));

vi.mock('@ovhcloud/manager-components', () => ({
  useNotifications: () => vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
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

describe('AddVoucherPage', () => {
  it('renders AddVoucherModal with correct props', () => {
    const { getByTestId } = render(<AddVoucherPage />, { wrapper });

    expect(getByTestId('AddVoucherModal-modal')).toBeInTheDocument();
  });
});
