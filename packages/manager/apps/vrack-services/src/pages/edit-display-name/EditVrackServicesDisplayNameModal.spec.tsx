import { describe, it } from 'vitest';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  assertEnabled,
  assertModalText,
  changeInputValueByTestId,
  doActionOnElementUntil,
  getElementByText,
  labels,
  renderTestComponent,
} from '@/test-utils';
import EditVrackServicesDisplayNameModal from './EditVrackServicesDisplayNameModal.page';

describe('Vrack Services edit name test suite', () => {
  it('should display the edit name modal', async () => {
    // Given / When
    const { container } = await renderTestComponent({
      component: <EditVrackServicesDisplayNameModal />,
      nbVs: 1,
    });

    await assertModalText({
      container,
      text: labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        vrackServicesListMocks[0].id,
      ),
    });

    await changeInputValueByTestId({
      testId: 'update-name-modal-input',
      value: 'new name',
    });

    const modifyButton = await getElementByText({
      // container,
      value: labels.actions.confirm,
    });

    await assertEnabled(modifyButton);
    const modal = container.querySelector('ods-modal');
    await doActionOnElementUntil(
      () => userEvent.click(modifyButton),
      () => expect(modal).not.toBeInTheDocument(),
    );
  });
});
