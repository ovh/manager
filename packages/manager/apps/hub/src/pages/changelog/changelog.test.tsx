import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import Changelog from './Changelog';

const trackClickMock = vi.fn();
const trackPageMock = vi.fn();

const mocks: any = vi.hoisted(() => ({
  isAccountSidebarVisible: false,
  region: 'EU',
  shellContext: {
    shell: {
      ux: {
        hidePreloader: vi.fn(),
        stopProgress: vi.fn(),
        isAccountSidebarVisible: () => mocks.isAccountSidebarVisible,
      },
      tracking: {
        trackImpression: vi.fn(),
        trackClickImpression: vi.fn(),
      },
    },
    environment: {
      getRegion: vi.fn(() => mocks.region),
    },
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: vi.fn(() => ({
      trackPage: trackPageMock,
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
      usePageTracking: vi.fn(),
    })),
    useRouteSynchro: vi.fn(() => {}),
  };
});

const renderComponent = () =>
  render(
    <ShellContext.Provider
      value={(mocks.shellContext as unknown) as ShellContextType}
    >
      <Changelog />
    </ShellContext.Provider>,
  );

describe('Changelog.page', () => {
  it('should render component', async () => {
    const { findByTestId } = renderComponent();

    const changelogPage = await findByTestId('roadmap-changelog-page');
    expect(changelogPage).not.toBeNull();
  });

  it('external links are clickable', async () => {
    trackClickMock.mockReset();
    const { getByTestId, findByTestId } = renderComponent();

    const link = await findByTestId('changelog-cloud-link');
    expect(getByTestId('changelog-cloud-link')).not.toBeNull();

    await act(() => fireEvent.click(link));

    expect(trackClickMock).toHaveBeenCalledWith({
      actionType: 'action',
      actions: ['go-to-changelog-cloud-products'],
      buttonType: 'external-link',
      location: 'page',
    });
  });
});
