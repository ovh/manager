import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
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
  ResourceStatus,
  useVeeamBackup,
  VeeamBackup,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';
import OrganizationDataProtectionTile from './OrganizationDataProtectionTile.component';

vi.mock('@ovh-ux/manager-module-vcd-api', () => ({
  useVeeamBackup: vi.fn(),
  getBackupIdFromOrganization: vi.fn(),
}));
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
  it('should define all sections with correct typo', async () => {
    // when
    await act(async () => renderComponent());
    const { getByText } = screen;

    // then
    const dataTitle = getByText('managed_vcd_dashboard_data_protection');
    expect(dataTitle).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._400);
    expect(dataTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const backupTitle = getByText('Managed Backup');
    expect(backupTitle).toHaveAttribute('size', ODS_THEME_TYPOGRAPHY_SIZE._200);
    expect(backupTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );

    // and
    const recoveryTitle = getByText('Managed Backup');
    expect(recoveryTitle).toHaveAttribute(
      'size',
      ODS_THEME_TYPOGRAPHY_SIZE._200,
    );
    expect(recoveryTitle).toHaveAttribute(
      'level',
      ODS_THEME_TYPOGRAPHY_LEVEL.heading,
    );
  });
});

describe('OrganizationDataProtectionTile query state-based behavior unit test suite', () => {
  it('should display backupLoading when query isLoading', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isLoading: true,
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    await act(async () => renderComponent());
    const { getByTestId } = screen;

    // then
    expect(getByTestId('backupLoading')).toBeInTheDocument();
  });

  it('should display backupError when query isError', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isError: true,
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    await act(async () => renderComponent());
    const { getByTestId } = screen;

    // then
    expect(getByTestId('backupError')).toHaveTextContent(
      'managed_vcd_dashboard_backup_status_error',
    );
  });

  it('should display noBackup when query isError 404', async () => {
    vi.mocked(useVeeamBackup).mockReturnValue({
      isError: true,
      error: { response: { status: 404 } },
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    await act(async () => renderComponent());
    const { getByTestId } = screen;

    // then
    expect(getByTestId('noBackup')).toBeInTheDocument();
  });

  it('should display backupStatus when query isSuccess', async () => {
    const testStatus: ResourceStatus = 'READY';
    vi.mocked(useVeeamBackup).mockReturnValue({
      isSuccess: true,
      data: { data: { resourceStatus: testStatus } },
    } as UseQueryResult<ApiResponse<VeeamBackup>, ApiError>);

    // when
    await act(async () => renderComponent());
    const { getByTestId } = screen;

    // then
    expect(getByTestId('backupStatus')).toBeInTheDocument();
  });
});
