import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';
import * as useAgreementsUpdateModule from '@/hooks/agreements/useAgreements';

const mocks = vi.hoisted(() => ({
  isAuthorized: false,
  region: 'US',
  agreements: [],
}));

const shellContext = {
  shell: {
    getPlugin: (plugin: string) => {
      switch (plugin) {
        case 'navigation': return {
          getURL: vi.fn(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('http://fakelink.com'), 50);
              }),
          ),
          navigateTo: vi.fn(() => mocks.region),
        };
        case 'ux': return {
          notifyModalActionDone: vi.fn(),
        };
        case 'environment': return {
          getEnvironment: () => ({
            getRegion: vi.fn(() => mocks.region),
            getApplicationURL: vi.fn((app) => `https://ovh.com/manager/${app}`)
          })
        };
      }
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

const mockedUseAgreementsUpdate = vi.spyOn(useAgreementsUpdateModule, 'useAgreementsUpdate');

describe('AgreementsUpdateModal', () => {
  it('should not display if agreements update are not ready', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: false,
      shouldBeDisplayed: false,
      updatePreference: vi.fn(),
    });
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
  it('should display nothing if agreements update are not to be displayed', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: false,
      updatePreference: vi.fn(),
    });
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
  it('should display a modal if agreements update are ready and to be displayed', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: true,
      updatePreference: vi.fn(),
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId('agreements-update-modal')).not.toBeNull();
  });
  it('should not reopen once closed', async () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: true,
      updatePreference: vi.fn(),
    });
    const { getByTestId, queryByTestId, queryByText } = renderComponent();
    expect(getByTestId('agreements-update-modal')).not.toBeNull();
    const button = queryByText('agreements_update_modal_action');
    await act(() => fireEvent.click(button));
    expect(queryByTestId('agreements-update-modal')).not.toBeInTheDocument();
  });
})
