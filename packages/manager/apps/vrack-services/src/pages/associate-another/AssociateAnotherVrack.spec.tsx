import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  vrackServicesListMocks,
  vrackListMocks,
} from '@ovh-ux/manager-network-common';
import {
  assertModalText,
  assertModalVisibility,
  getButtonByLabel,
  changeOdsSelectValueByName,
  getButtonByIcon,
  labels,
  renderTest,
  assertEnabled,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services associate another vrack test suite', () => {
  it('from dashboard should associate another vrack using vrack modal', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[5].id),
      nbVs: 6,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });

    await waitFor(() => userEvent.click(actionMenuButton));

    const associateAnotherLink = await getButtonByLabel({
      container,
      value: labels.common.vrackActionAssociateToAnother,
    });

    await waitFor(() => userEvent.click(associateAnotherLink));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.associate.modalAssociateAnotherVrackTitle,
    });

    await assertModalText({
      container,
      text: labels.associate.modalAssociateAnotherVrackDescription,
    });
    await assertModalText({
      container,
      text: vrackServicesListMocks[5].currentState.vrackId,
    });
    await changeOdsSelectValueByName({
      container,
      name: 'select-another-vrack',
      value: vrackListMocks[1],
    });

    const associateButton = await getButtonByLabel({
      container,
      value: labels.associate.modalConfirmVrackAssociationButtonLabel,
    });
    await assertEnabled(associateButton);
    await waitFor(() => userEvent.click(associateButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('from dashboard, should propose user to create vrack if no eligible vrack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociateAnother.replace(
        ':id',
        vrackServicesListMocks[5].id,
      ),
      nbVs: 6,
      nbVrack: 0,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.createVrack.modalVrackCreationDescriptionLine1,
    });
  });

  it('from dashboard, display error when get vrack is in error', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociateAnother.replace(
        ':id',
        vrackServicesListMocks[5].id,
      ),
      nbVs: 6,
      getVrackKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.associate.modalVrackAssociationError.replace(
        '{{error}}',
        'Get vRack KO',
      ),
    });
  });
});
