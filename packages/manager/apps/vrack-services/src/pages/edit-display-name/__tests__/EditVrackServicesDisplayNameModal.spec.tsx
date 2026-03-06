import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';

import { labels } from '@/__tests__/test-i18n';
import {
  assertEnabled,
  assertModalText,
  changeInputValueByTestId,
  doActionOnElementUntil,
  getElementByText,
  renderTestComponent,
} from '@/__tests__/uiTestHelpers';

import EditVrackServicesDisplayNameModal from '../EditVrackServicesDisplayNameModal.page';

describe('Vrack Services edit name test suite', () => {
  it('should display the edit name modal', async () => {
    // Given / When
    const { container } = await renderTestComponent({
      component: <EditVrackServicesDisplayNameModal />,
      nbVs: 1,
    });

    await assertModalText(
      labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        vrackServicesListMocks[0]?.id ?? '',
      ),
    );

    await changeInputValueByTestId({
      testId: 'update-name-modal-input',
      value: 'new name',
    });

    const modifyButton = await getElementByText({
      value: labels.actions.confirm,
    });

    if (modifyButton) {
      await assertEnabled(modifyButton);
      const modal = container.querySelector('ods-modal');
      await doActionOnElementUntil(
        () => void userEvent.click(modifyButton),
        () => expect(modal).not.toBeInTheDocument(),
      );
    } else {
      expect.fail();
    }
  });
});
