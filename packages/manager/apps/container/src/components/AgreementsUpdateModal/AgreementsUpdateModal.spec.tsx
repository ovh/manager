import { vi } from 'vitest';
import { render } from '@testing-library/react';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';
import ModalsContext from '@/context/modals/modals.context';

const context = vi.hoisted(() => ({
  data: null,
}));

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      // eslint-disable-next-line consistent-return
      getPlugin: (plugin: string) => {
        // eslint-disable-next-line default-case
        switch (plugin) {
          case 'navigation':
            return {
              getURL: vi.fn(
                () =>
                  new Promise((resolve) => {
                    setTimeout(() => resolve('http://fakelink.com'), 50);
                  }),
              ),
              navigateTo: vi.fn(),
            };
          case 'environment':
            return {
              getEnvironment: () => ({
                getRegion: vi.fn(),
                getApplicationURL: vi.fn(
                  (app) => `https://ovh.com/manager/${app}`,
                ),
              }),
            };
        }
      },
    },
  }),
}));

const renderComponent = () =>
  render(
    <ModalsContext.Provider value={context}>
      <AgreementsUpdateModal />
    </ModalsContext.Provider>,
  );

describe('AgreementsUpdateModal', () => {
  it('should render', () => {
    const { queryByTestId } = renderComponent();
    expect(queryByTestId('agreements-update-modal')).not.toBeNull();
  });
});
