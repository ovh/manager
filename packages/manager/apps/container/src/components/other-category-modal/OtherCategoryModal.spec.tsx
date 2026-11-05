import { vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as useModalModule from '@/hooks/modal/useModal';
import OtherCategoryModal from './OtherCategoryModal.component';

const ACCOUNT_EDITION_LINK =
  'https://fake-manager.com/manager/account/#/useraccount/infos';

const notifyModalActionDone = vi.fn();
const user = { legalform: 'other', country: 'FR' };
const trackClick = vi.fn();
const trackPage = vi.fn();

// The global mock renders <Trans> children only: render its key instead, to
// tell the two wordings apart.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

vi.mock('@/data/hooks/suggestion/useSuggestion', () => ({
  useSuggestionTargetUrl: () => ACCOUNT_EDITION_LINK,
}));

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      getPlugin: (plugin: string) => {
        switch (plugin) {
          case 'ux':
            return { notifyModalActionDone };
          case 'tracking':
            return { trackClick, trackPage };
          case 'environment':
            return { getEnvironment: () => ({ getUser: () => user }) };
          default:
            return {};
        }
      },
    },
  }),
}));

const renderComponent = () => render(<OtherCategoryModal />);

describe('OtherCategoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    user.country = 'FR';
    Object.defineProperty(window, 'top', {
      value: { location: { href: '' } },
      writable: true,
    });
  });

  it('renders when the display check resolves to true', async () => {
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(true);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('other-category-modal')).not.toBeNull();
    });
  });

  it('does not render when the display check resolves to false', async () => {
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(false);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('other-category-modal')).toBeNull();
    });
  });

  it('does not render while the display check is undefined', async () => {
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(undefined);

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(queryByTestId('other-category-modal')).toBeNull();
    });
  });

  it('gives a French customer the e-invoicing reform wording', async () => {
    user.country = 'GP';
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(true);

    const { getByText } = renderComponent();

    expect(getByText('other_category_modal_description')).not.toBeNull();
  });

  it('gives every other country the generic wording', async () => {
    user.country = 'TR';
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(true);

    const { getByText } = renderComponent();

    expect(getByText('other_category_modal_description_generic')).not.toBeNull();
  });

  it('is shown whatever the country, with no feature flag', () => {
    const spy = vi
      .spyOn(useModalModule, 'useCheckModalDisplay')
      .mockReturnValue(true);

    renderComponent();

    // third argument: the features to check
    expect(spy.mock.calls[0][2]).toBeUndefined();
  });

  it('redirects to the legalform select of the account edition form on CTA click', async () => {
    vi.spyOn(useModalModule, 'useCheckModalDisplay').mockReturnValue(true);

    const { getByText } = renderComponent();

    fireEvent.click(getByText('other_category_modal_action_modify'));

    expect(window.top.location.href).toBe(
      `${ACCOUNT_EDITION_LINK}?fieldToFocus=ovh_field_legalform`,
    );
    expect(notifyModalActionDone).toHaveBeenCalled();
  });
});
