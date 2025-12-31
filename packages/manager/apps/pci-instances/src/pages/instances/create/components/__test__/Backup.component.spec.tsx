import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { describe, expect, it, vi } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Backup from '../Backup.component';
import {
  selectLocalBackups,
  selectDistantBackupLocalizations,
} from '../../view-models/backupViewModel';
import { mockedLocalBackups } from '@/__mocks__/instance/constants';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

const selectLocalBackupsMock = vi.fn();

vi.mock('../../view-models/backupViewModel');
vi.mocked(selectLocalBackups).mockImplementation(selectLocalBackupsMock);
vi.mocked(selectDistantBackupLocalizations).mockReturnValue([]);

const setupTest = () => {
  selectLocalBackupsMock.mockReturnValue({
    items: mockedLocalBackups,
    price: '~0,015 € HT/mois/Go',
  });

  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{ localBackup: mockedLocalBackups[0]?.value ?? null }}
    >
      <Backup />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering Backup component', () => {
  it('should track when helper is opened', async () => {
    setupTest();

    await act(async () => {
      await userEvent.click(
        screen.getByText('common:pci_instances_common_help'),
      );
    });

    await waitFor(() =>
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.link,
        actionType: 'action',
        actions: ['add_instance', 'go-to-see-documentation_backup'],
      }),
    );
  });

  it('should checked by default the auto backup local', async () => {
    setupTest();

    await waitFor(() =>
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_auto_backup_checkbox_label/i,
        ),
      ).toBeChecked(),
    );
  });

  it('should display backup price', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByText(
          /creation:pci_instance_creation_backup_billing_label\s+~0,015.*HT\/mois\/Go/,
        ),
      ).toBeVisible();
    });
  });

  it('should display the disabled coming soon custom rotation', async () => {
    setupTest();

    await waitFor(() =>
      expect(screen.getByLabelText(/Custom/i)).toBeDisabled(),
    );
  });

  it('should display all backup items and select by default the first item', async () => {
    setupTest();

    await waitFor(() => {
      const [selectedBackup] = mockedLocalBackups;

      // eslint-disable-next-line max-nested-callbacks
      mockedLocalBackups.forEach(({ label, value, description }) => {
        const input = screen.getByLabelText(new RegExp(label, 'i'));

        expect(input).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(input).toHaveAttribute('value', value);

        if (selectedBackup?.value === value) expect(input).toBeChecked();
      });
    });
  });

  it('should not display hide all backup config when auto backup local is unchecked', async () => {
    setupTest();

    await act(async () => {
      await userEvent.click(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_auto_backup_checkbox_label/i,
        ),
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText(
          /creation:pci_instance_creation_backup_billing_label\s+~0,015.*HT\/mois\/Go/,
        ),
      ).not.toBeInTheDocument();

      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    });
  });

  it('should unchecked by default the remote backup', async () => {
    setupTest();

    await waitFor(() =>
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_distant_backup_checkbox_label/i,
        ),
      ).not.toBeChecked(),
    );
  });
});
