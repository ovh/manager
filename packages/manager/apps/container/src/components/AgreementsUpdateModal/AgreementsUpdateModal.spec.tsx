import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';

const mocks = vi.hoisted(() => ({
  isAuthorized: false,
  region: 'US',
  agreements: [],
}));

const shellContext = {
  shell: {
    getPlugin: (plugin: string) => {
      if (plugin === 'navigation') {
        return {
          getURL: vi.fn(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('http://fakelink.com'), 50);
              }),
          ),
        };
      }
      return {
        getEnvironment: () => ({
          getRegion: vi.fn(() => mocks.region),
        })
      };
    },
  }
};

const queryClient = new QueryClient();
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <AgreementsUpdateModal />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

vi.mock('react', async (importOriginal) => {
  const module = await importOriginal<typeof import('react')>();
  return {
    ...module,
    useContext: () => shellContext
  }
});

vi.mock('@/hooks/accountUrn/useAccountUrn', () => ({
  default: () => () => 'urn'
}));

vi.mock('@ovh-ux/manager-react-components/src/hooks/iam', () => ({
  useAuthorizationIam: () => () => ({ isAuthorized: mocks.isAuthorized })
}));

vi.mock('@/hooks/agreements/useAgreementsUpdate', () => ({
  default: () => ({ data: mocks.agreements })
}));

describe('AgreementsUpdateModal', () => {
  it('should display nothing for US customers', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
  it('should display nothing for non US and non authorized customers', () => {
    mocks.region = 'EU';
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
  it('should display a modal for non US and authorized customers without new contract', () => {
    mocks.isAuthorized = true;
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
  it('should display a modal for non US and authorized customers', () => {
    mocks.agreements.push({ agreed: false, id: 9999, contractId: 9999 });
    const { getByTestId } = renderComponent();
    expect(getByTestId('agreements-update-modal')).not.toBeNull();
  });
})
