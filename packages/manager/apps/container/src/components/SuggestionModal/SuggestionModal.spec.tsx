import { render } from '@testing-library/react';
import { vi } from 'vitest';
import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';
import ModalsContext from '@/context/modals/modals.context';

const mocks = vi.hoisted(() => ({
  user: {
    companyNationalIdentificationNumber: 'suggestedNIN',
    vat: 'suggestedVAT',
  },
  context: {
    data: [
      {
        type: 'SIRET',
        id: 'suggestedNIN',
      },
      {
        type: 'VAT',
        id: 'suggestedVAT',
      },
    ],
  },
}));

const shell = {
  // eslint-disable-next-line consistent-return
  getPlugin: (plugin: string) => {
    // eslint-disable-next-line default-case
    switch (plugin) {
      case 'navigation':
        return {
          getURL: vi.fn(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve('https://fakelink.com'), 50);
              }),
          ),
          navigateTo: vi.fn(() => {}),
        };
      case 'ux':
        return {
          notifyModalActionDone: vi.fn(),
        };
      case 'environment':
        return {
          getEnvironment: () => ({
            getApplicationURL: vi.fn((app) => `https://ovh.com/manager/${app}`),
            getUser: () => mocks.user,
          }),
        };
    }
  },
};

const renderComponent = () =>
  render(
    <ModalsContext.Provider value={mocks.context}>
      <SuggestionModal />
    </ModalsContext.Provider>,
  );

vi.mock('@/context', () => ({
  useApplication: () => ({ shell }),
}));

describe('SuggestionModal', () => {
  it('should not display if suggestions do not differ from user data', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('suggestion-modal')).not.toBeInTheDocument();
  });
  it('should display if at least one suggestion differ from user data', () => {
    mocks.user.companyNationalIdentificationNumber = 'differentNIN';
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('suggestion-modal')).toBeInTheDocument();
  });
});
