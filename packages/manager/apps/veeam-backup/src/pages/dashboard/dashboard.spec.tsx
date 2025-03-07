import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getButtonByIcon,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest, labels, goToDashboard } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';
import useVeeamBackupConsumption from '@/data/hooks/useVeeamBackupConsumption';
import { VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE } from '@/pages/dashboard/Dashboard.constants';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
  };
});

vi.mock('@/data/hooks/useVeeamBackupConsumption', () => ({
  default: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    isPending: false,
  })),
}));

describe('dashboard', () => {
  it('displays the dashboard page when clicking on the link', async () => {
    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            new RegExp(
              labels.dashboard.administrator_contact.replace('{{code}}', '.*'),
            ),
          ),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('actions are disabled if backup is not ready', async () => {
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[2].id),
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            new RegExp(
              labels.dashboard.administrator_contact.replace('{{code}}', '.*'),
            ),
          ),
        ),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.PEN,
      disabled: true,
    });

    await getButtonByLabel({
      container,
      label: labels.dashboard.delete_service,
      disabled: true,
    });

    expect(screen.getByText(labels.dashboard.terminated_service)).toBeVisible();
  });

  it('displays 0 VMs when no consumption data is empty', async () => {
    vi.mocked(useVeeamBackupConsumption).mockImplementation(() => ({
      data: [],
      isLoading: false,
      isError: false,
      isPending: false,
    }));

    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);
    await waitFor(() => {
      expect(screen.queryByTestId('consumed-vms')).toHaveTextContent('0 VMs');
    });
  });

  it('displays 0 VMs when  consumption data not having  backup-veeam-vcd-vm plan Code', async () => {
    vi.mocked(useVeeamBackupConsumption).mockImplementation(() => ({
      data: [{ planCode: 'randomCode', uniqueId: 'id', quantity: 0 }],
      isLoading: false,
      isError: false,
      isPending: false,
    }));

    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);
    await waitFor(() => {
      expect(screen.queryByTestId('consumed-vms')).toHaveTextContent('0 VMs');
    });
  });

  it('displays 2 VMs when  consumption data not having  backup-veeam-vcd-vm plan Code', async () => {
    vi.mocked(useVeeamBackupConsumption).mockImplementation(() => ({
      data: [
        { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
        { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
        {
          planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
          uniqueId: 'id3',
          quantity: 0,
        },
        {
          planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
          uniqueId: 'id4',
          quantity: 0,
        },
      ],
      isLoading: false,
      isError: false,
      isPending: false,
    }));

    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);
    await waitFor(() => {
      expect(screen.queryByTestId('consumed-vms')).toHaveTextContent('2 VMs');
    });
  });
});
