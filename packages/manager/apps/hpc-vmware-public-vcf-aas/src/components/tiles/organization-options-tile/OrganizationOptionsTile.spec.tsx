import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, it, vi, expect, afterEach, vitest } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import OrganizationOptionsTile from './OrganizationOptionsTile.component';
import { labels } from '../../../test-utils';
import { TRACKING } from '../../../tracking.constants';
import TEST_IDS from '../../../utils/testIds.constants';

vi.stubGlobal('open', vi.fn());

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

const shellContext = {
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(),
  },
};

afterEach(() => {
  vitest.resetAllMocks();
});

const renderComponent = ({
  isDisabled,
  isLicenseActive,
}: {
  isDisabled: boolean;
  isLicenseActive: boolean;
}) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrganizationOptionsTile
          isLicenseActive={isLicenseActive}
          isDisabled={isDisabled}
        />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('OrganizationOptionsTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    renderComponent({ isDisabled: false, isLicenseActive: false });

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_windows_license,
    ];

    elements.forEach(async (element) => assertTextVisibility(element));
  });

  it('should track click on activateLicense', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'open');

    // when
    renderComponent({ isDisabled: false, isLicenseActive: false });

    // then
    const menu = screen.getByTestId('navigation-action-trigger-action');
    await act(() => user.click(menu));

    // and
    const activateLicenseButton = await getElementByTestId(
      TEST_IDS.activateLicenseCta,
    );

    await act(() => user.click(activateLicenseButton));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.dashboard.activateWindowsLicence,
    );
    expect(window.open).toHaveBeenCalledOnce();
  });

  it('should not be able to activate license when service is disabled', async () => {
    // when
    renderComponent({ isDisabled: true, isLicenseActive: false });

    // then
    const menu = screen.getByTestId('navigation-action-trigger-action');
    expect(menu.getAttribute('is-disabled')).toBe('true');
  });

  it('should not display action menu when licence is active', async () => {
    // when
    renderComponent({ isDisabled: true, isLicenseActive: true });

    // then
    expect(
      screen.queryByText('managed_vcd_dashboard_windows_license_active'),
    ).toBeDefined();
    const menu = screen.queryByTestId('navigation-action-trigger-action');
    expect(menu).not.toBeInTheDocument();
  });
});
