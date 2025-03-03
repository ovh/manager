import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import AgreementsUpdateModal from '@/components/SuggestionModal/SuggestionModal.component';
import * as useSuggestionModule from '@/hooks/suggestion/useSuggestion';

const shellContext = {
  shell: {
    getPlugin: (plugin: string) => {
      switch (plugin) {
        case 'navigation': return {
          getURL: vi.fn(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('https://fakelink.com'), 50);
              }),
          ),
          navigateTo: vi.fn(() => {}),
        };
        case 'ux': return {
          notifyModalActionDone: vi.fn(),
        };
        case 'environment': return {
          getEnvironment: () => ({
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

const mockedUseAgreementsUpdate = vi.spyOn(useSuggestionModule, 'useSuggestionForUserProfile');

describe('AgreementsUpdateModal', () => {
  it('should not display if agreements update are not ready', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: false,
      shouldBeDisplayed: false,
      updatePreference: vi.fn(),
      suggestions: undefined,
    });
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('suggestion-modal')).not.toBeInTheDocument();
  });
  it('should display nothing if agreements update are not to be displayed', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: false,
      updatePreference: vi.fn(),
      suggestions: undefined,
    });
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('suggestion-modal')).not.toBeInTheDocument();
  });
  it('should display a modal if agreements update are ready and to be displayed', () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: true,
      updatePreference: vi.fn(),
      suggestions: undefined,
    });
    const { getByTestId } = renderComponent();
    expect(getByTestId('suggestion-modal')).not.toBeNull();
  });
  it('should not reopen once closed', async () => {
    mockedUseAgreementsUpdate.mockReturnValue({
      isReady: true,
      shouldBeDisplayed: true,
      updatePreference: vi.fn(),
      suggestions: undefined,
    });
    const { getByTestId, queryByTestId, queryByText } = renderComponent();
    expect(getByTestId('suggestion-modal')).not.toBeNull();
    const button = queryByText('suggestion_modal_action_confirm');
    await act(() => fireEvent.click(button));
    expect(queryByTestId('suggestion-modal')).not.toBeInTheDocument();
  });
})
