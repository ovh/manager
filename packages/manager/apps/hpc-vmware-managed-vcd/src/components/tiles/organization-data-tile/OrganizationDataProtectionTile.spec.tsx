import { act, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  useVeeamBackup,
  VeeamBackup,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import OrganizationDataProtectionTile from './OrganizationDataProtectionTile.component';
import { labels } from '../../../test-utils';
import {
  DATA_PROTECTION_BACKUP_LABEL,
  DATA_PROTECTION_RECOVERY_LABEL,
} from '../../../pages/dashboard/organization/organizationDashboard.constants';
import TEST_IDS from '../../../utils/testIds.constants';
import { TRACKING } from '../../../tracking.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('@ovh-ux/manager-module-vcd-api', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-module-vcd-api') = await importOriginal();
  return {
    ...original,
    useVeeamBackup: vi.fn(),
    getBackupIdFromOrganization: vi.fn(),
  };
});

vi.mocked(useVeeamBackup).mockReturnValue(
  {} as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>,
);

const shellContext = {
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('https://www.ovh.com'),
    },
  },
};

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrganizationDataProtectionTile vcdOrganization={organizationList[0]} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('OrganizationDataProtectionTile component unit test suite', () => {
  it('should define tileTitle and sections', async () => {
    // when
    renderComponent();

    // then
    const elements = [
      labels.dashboard.managed_vcd_dashboard_data_protection,
      DATA_PROTECTION_BACKUP_LABEL,
      DATA_PROTECTION_RECOVERY_LABEL,
    ];

    elements.forEach(async (element) => assertTextVisibility(element));
  });

  it('should track click on redirect to VeeamBackup', async () => {
    const user = userEvent.setup();
    // when
    renderComponent();

    // then
    const veeamLink = await getElementByTestId(
      TEST_IDS.dashboardVeeamBackupLink,
    );
    await act(() => user.click(veeamLink));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.dashboard.goToManageBackup,
    );
  });
});

describe('OrganizationDataProtectionTile query state-based behavior unit test suite', () => {
  it('should display backupLoading when query isLoading', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isLoading: true,
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    renderComponent();

    // then
    const loading = await getElementByTestId(TEST_IDS.backupBadgeLoading);
    await assertElementVisibility(loading);
  });

  it('should display backupError when query isError', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isError: true,
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    renderComponent();

    // then
    const badge = await getElementByTestId(TEST_IDS.backupBadgeError);
    await assertElementVisibility(badge);
    await assertElementLabel({
      element: badge,
      label: 'managed_vcd_dashboard_backup_status_error',
    });
  });

  it('should display noBackup when query isError 404', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isError: true,
      error: { response: { status: 404 } },
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    renderComponent();

    // then
    const badge = await getElementByTestId(TEST_IDS.backupBadgeNone);
    await assertElementVisibility(badge);
    await assertElementLabel({
      element: badge,
      label: 'managed_vcd_dashboard_backup_status_unsubscribed',
    });
  });

  it('should display backupStatus when query isSuccess', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isSuccess: true,
      data: { data: { resourceStatus: 'READY' } },
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    renderComponent();

    // then
    const badge = await getElementByTestId(TEST_IDS.backupBadgeStatus);
    await assertElementVisibility(badge);
    await assertElementLabel({
      element: badge,
      label: 'managed_vcd_dashboard_backup_status_subscribed',
    });
  });
});
