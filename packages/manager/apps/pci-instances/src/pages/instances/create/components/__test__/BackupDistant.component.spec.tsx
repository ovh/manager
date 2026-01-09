import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackupDistant from '../backup/BackupDistant.component';
import {
  selectDistantBackupLocalizations,
  TDistantBackupLocalizationItemData,
} from '../../view-models/backupViewModel';
import { mockedDistantBackupLocalizations } from '@/__mocks__/instance/constants';
import { SelectGroupItem } from '@ovhcloud/ods-react';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

vi.mock('../../view-models/backupViewModel');
vi.mocked(selectDistantBackupLocalizations).mockReturnValue(
  mockedDistantBackupLocalizations as SelectGroupItem<
    TDistantBackupLocalizationItemData
  >[],
);

describe('Considering BackupDistant component', () => {
  it('should display banner when activate distant backup', async () => {
    renderWithMockedWrappers(
      <TestCreateInstanceFormWrapper
        defaultValues={{ distantBackupLocalization: null }}
      >
        <BackupDistant />
      </TestCreateInstanceFormWrapper>,
    );

    await act(async () => {
      await userEvent.click(
        screen.getByLabelText(
          /creation:pci_instance_creation_backup_setting_distant_backup_checkbox_label/i,
        ),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'creation:pci_instance_creation_backup_setting_distant_backup_warning_message',
        ),
      ).toBeVisible();

      expect(
        screen.getByLabelText(
          'regions:manager_components_select_localization_label',
        ),
      ).toBeVisible();

      mockedDistantBackupLocalizations
        // eslint-disable-next-line max-nested-callbacks
        .flatMap(({ options: localization }) => localization)
        // eslint-disable-next-line max-nested-callbacks
        .forEach(({ label, value }) => {
          const options = screen.getAllByText(label);

          const optionWithValue = options.find(
            // eslint-disable-next-line max-nested-callbacks
            (option) => option.getAttribute('value') === value,
          );

          expect(optionWithValue).toBeInTheDocument();
        });
    });
  });
});
