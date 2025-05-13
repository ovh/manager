import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import {
  assertOdsModalVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';
import TEST_IDS from '@/utils/testIds.constants';

describe('Delete veeam-backup', () => {
  it('Delete a backup', async () => {
    const user = userEvent.setup();
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    const deleteButton = await getElementByTestId(TEST_IDS.deleteServiceCta);
    expect(deleteButton).toBeEnabled();

    await act(() => user.click(deleteButton));
    await assertOdsModalVisibility({ container, isVisible: true });
  });
});
