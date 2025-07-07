import { screen, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
  getElementByTestId,
  getNthElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { backupList, VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import userEvent from '@testing-library/user-event';
import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';
import TEST_IDS from '@/utils/testIds.constants';
import routes from '@/routes/routes';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
    GuideButton: () => <div data-testid="guide-button">Guide Button</div>,
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    OdsLink: vi
      .fn()
      .mockImplementation(({ label, ...rest }) => <a {...rest}>{label}</a>),
  };
});

describe('dashboard', () => {
  const getFirstBackupLink = (veeamBackup: VeeamBackup) =>
    screen.getByRole('link', {
      name: veeamBackup.iam.displayName,
    });

  it('displays the dashboard page when clicking on the link', async () => {
    const veeamBackup = backupList[0];
    await renderTest();

    await waitFor(() => expect(getFirstBackupLink(veeamBackup)).toBeVisible());

    expect(getFirstBackupLink(veeamBackup)).toHaveAttribute(
      'href',
      urls.dashboard.replace(':id', veeamBackup.id),
    );
  });

  it('actions are disabled if backup is not ready', async () => {
    await renderTest({
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

    const editButton = await getElementByTestId(TEST_IDS.editNameCta);
    expect(editButton).toBeDisabled();

    const deleteButton = await getElementByTestId(TEST_IDS.deleteServiceCta);
    expect(deleteButton).toBeDisabled();

    await assertTextVisibility(labels.dashboard.terminated_service);
  });

  it('display guide button on the layout', async () => {
    await renderTest({
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

    const guideButton = await getElementByTestId('guide-button');
    expect(guideButton).toBeInTheDocument();
  });
});
