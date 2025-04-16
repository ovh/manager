import { act, render, screen } from '@testing-library/react';
import { describe, it, vi, expect, afterEach, vitest } from 'vitest';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18n as i18nType } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  assertAsyncTextVisibility,
  assertTextVisibility,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import OrganizationOptionsTile from './OrganizationOptionsTile.component';
import { labels, translations } from '../../../test-utils';
import { APP_NAME, TRACKING } from '../../../tracking.constants';
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

afterEach(() => {
  vitest.resetAllMocks();
});

let i18n: i18nType;
const shellContext = {
  environment: {
    getRegion: vi.fn(),
    getUser: vi.fn(),
  },
};

const renderComponent = async () => {
  const queryClient = new QueryClient();
  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  return render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <OrganizationOptionsTile isLicenseActive={false} />
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

describe('OrganizationOptionsTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_options,
      labels.dashboard.managed_vcd_dashboard_windows_license,
    ];

    // TESTING : check asynchronously for the first element, then check synchronously
    await assertAsyncTextVisibility(elements[0]);
    elements.slice(1).forEach(assertTextVisibility);
  });

  it('should track click on activateLicense', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'open');

    // when
    renderComponent();

    // then
    const menu = screen.getByTestId('navigation-action-trigger-action');
    await act(() => user.click(menu));

    // and
    const activateLicenseButton = screen.getByTestId(
      TEST_IDS.activateLicenseCta,
    );

    await act(() => user.click(activateLicenseButton));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.dashboard.activateWindowsLicence,
    );
    expect(window.open).toHaveBeenCalledOnce();
  });
});
