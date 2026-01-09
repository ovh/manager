import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import Backup from '../Backup.component';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

vi.mock('../../view-models/backupViewModel', async (importOriginal) => {
  const original: typeof import('../../view-models/backupViewModel') = await importOriginal();

  return {
    ...original,
    selectDistantBackupLocalizations: vi.fn(),
  };
});

const setupTest = () => {
  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{
        localBackupRotation: '7',
      }}
    >
      <Backup />
    </TestCreateInstanceFormWrapper>,
  );
};

describe('Considering Backup component', () => {
  it('should track when helper is opened', async () => {
    setupTest();

    await userEvent.click(screen.getByText('common:pci_instances_common_help'));

    await waitFor(() =>
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.link,
        actionType: 'action',
        actions: ['add_instance', 'go-to-see-documentation_backup'],
      }),
    );
  });

  it('should be checked by default the auto backup local', async () => {
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
          /creation:pci_instance_creation_backup_billing_label\s+~0,011.*HT\/mois\/Go/,
        ),
      ).toBeVisible();
    });
  });

  it('should display the disabled coming soon custom rotation', async () => {
    setupTest();

    await waitFor(() =>
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_rotation_custom_label/i,
        ),
      ).toBeDisabled(),
    );
  });

  it.each([{ rotation: 7 }, { rotation: 14 }, { rotation: 'custom' }])(
    'should display backup item with rotation $rotation',
    async ({ rotation }) => {
      setupTest();

      await waitFor(() => {
        expect(
          screen.getByLabelText(
            `creation:pci_instance_creation_backup_setting_rotation_${rotation}_label`,
          ),
        ).toBeVisible();

        expect(
          screen.getByText(
            `creation:pci_instance_creation_backup_setting_rotation_description.${rotation}creation:pci_instance_creation_backup_setting_rotation_description.predefined`,
          ),
        ).toBeVisible();
      });
    },
  );

  it('should select by default the first backup item', async () => {
    setupTest();

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_rotation_7_label/i,
        ),
      ).toBeChecked();
    });
  });

  it('should hide all backup config when auto backup local is unchecked', async () => {
    setupTest();

    await userEvent.click(
      screen.getByLabelText(
        /creation:pci_instance_creation_backup_setting_auto_backup_checkbox_label/i,
      ),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /creation:pci_instance_creation_backup_billing_label\s+~0,011.*HT\/mois\/Go/,
        ),
      ).not.toBeInTheDocument();

      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    });
  });

  it('should be unchecked by default the remote backup', async () => {
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
