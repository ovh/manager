import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import {
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';
import TEST_IDS from '@/utils/testIds.constants';

describe('Activate offer', () => {
  it('activate the gold offer of backup', async () => {
    const user = userEvent.setup();
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    await assertTextVisibility(labels.dashboard.display_name);

    const actionButton = await getElementByTestId(
      TEST_IDS.activateGoldOfferAction,
    );
    await act(() => user.click(actionButton));
    await assertOdsModalVisibility({ container, isVisible: true });
  });
});
