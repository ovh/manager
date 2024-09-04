import { render } from '@testing-library/react';
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
import OrganizationDataProtectionTile from './OrganizationDataProtectionTile.component';
import { useManagedVcdOrganizationBackup } from '../../../data/hooks/useManagedVcdOrganization';
import IVcdOrganizationBackup, {
  BackupResourceStatus,
} from '../../../types/vcd-organization-backup.interface';

vi.mock('../../../data/hooks/useManagedVcdOrganization', () => ({
  useManagedVcdOrganizationBackup: vi.fn(),
}));
vi.mocked(useManagedVcdOrganizationBackup).mockReturnValue(
  {} as UseQueryResult<ApiResponse<IVcdOrganizationBackup>, ApiError>,
);

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <OrganizationDataProtectionTile />
    </QueryClientProvider>,
  );
};

describe('OrganizationDataProtectionTile component unit test suite', () => {
  it('should define all sections with correct typo', () => {
    // when
    const { getByText } = renderComponent();

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
  it('should display loader when the query is loading', () => {
    // when
    vi.mocked(useManagedVcdOrganizationBackup).mockReturnValue({
      isLoading: true,
    } as UseQueryResult<ApiResponse<IVcdOrganizationBackup>, ApiError>);

    const { getByTestId } = renderComponent();
    // then
    expect(getByTestId('loading')).toBeInTheDocument();
  });

  it('should display backupStatus when the query is not loading', () => {
    // when
    vi.mocked(useManagedVcdOrganizationBackup).mockReturnValue({
      isLoading: false,
    } as UseQueryResult<ApiResponse<IVcdOrganizationBackup>, ApiError>);

    const { getByTestId } = renderComponent();
    // then
    expect(getByTestId('backupStatus')).toBeInTheDocument();
  });

  it('should display backupErrorStatus when the query has an error', () => {
    // when
    vi.mocked(useManagedVcdOrganizationBackup).mockReturnValue({
      isError: true,
    } as UseQueryResult<ApiResponse<IVcdOrganizationBackup>, ApiError>);

    const { getByTestId } = renderComponent();
    // then
    expect(getByTestId('backupStatus')).toHaveTextContent(
      'managed_vcd_dashboard_backup_status_error',
    );
  });

  it('should display the corresponding status when the query has no error', () => {
    // when
    vi.mocked(useManagedVcdOrganizationBackup).mockReturnValue({
      data: { data: { resourceStatus: BackupResourceStatus.CREATING } },
    } as UseQueryResult<ApiResponse<IVcdOrganizationBackup>, ApiError>);

    const { getByTestId } = renderComponent();
    // then
    expect(getByTestId('backupStatus')).toHaveTextContent(
      'managed_vcd_dashboard_backup_status_CREATING',
    );
  });
});
