import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  vrackServicesListMocks,
  vrackListMocks,
} from '@ovh-ux/manager-network-common';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import {
  assertModalText,
  assertModalVisibility,
  changeOdsSelectValueByName,
  getButtonByIcon,
  labels,
  renderTest,
  getButtonByLabel,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services associate vrack test suite', () => {
  it('from dashboard should associate vrack using vrack modal', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[0].id),
      nbVs: 1,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const associateLink = await getButtonByLabel({
      container,
      value: labels.common.associateVrackButtonLabel,
    });
    await waitFor(() => userEvent.click(associateLink));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.associate.modalVrackAssociationTitle,
    });
    await assertModalText({
      container,
      text: labels.associate.modalVrackAssociationDescription,
    });
    await assertModalText({ container, text: vrackListMocks[0] });

    await changeOdsSelectValueByName({
      container,
      name: 'select-vrack-input',
      value: vrackListMocks[1],
    });

    const associateButton = await getButtonByLabel({
      container,
      value: labels.associate.modalConfirmVrackAssociationButtonLabel,
    });
    await waitFor(
      () => expect(associateButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    await waitFor(() => userEvent.click(associateButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('from dashboard, should propose user to create vrack if no eligible vrack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociate.replace(
        ':id',
        vrackServicesListMocks[0].id,
      ),
      nbVs: 1,
      nbEligibleVrackServices: 0,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.createVrack.modalVrackCreationDescriptionLine1,
    });
    await getButtonByLabel({
      container,
      value: labels.createVrack.modalCreateNewVrackButtonLabel,
    });
  });

  it('from dashboard, have disable action menu', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[2].id),
      nbVs: 3,
    });

    const button = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(
      () => expect(button).toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('from dashboard, display error when get vrack is in error', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociate.replace(
        ':id',
        vrackServicesListMocks[0].id,
      ),
      nbVs: 1,
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

  it('from dashboard, display error when vrack eligible services is in error', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociate.replace(
        ':id',
        vrackServicesListMocks[0].id,
      ),
      nbVs: 1,
      getVrackEligibleServicesKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.associate.modalVrackListInError.replace(
        '{{list}}',
        vrackListMocks.join(', '),
      ),
    });
  });
});
