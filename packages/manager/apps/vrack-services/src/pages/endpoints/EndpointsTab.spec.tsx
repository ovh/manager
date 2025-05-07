import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor, screen } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvent from '@testing-library/user-event';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { iamResourcesMocks } from '@/data/mocks/iam';
import {
  assertModalVisibility,
  getButtonByLabel,
  assertModalText,
  changeInputValueByLabelText,
  getButtonByIcon,
  labels,
  renderTest,
  assertDisabled,
  assertEnabled,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services endpoints page test suite', () => {
  it('should display the endpoints onboarding if no endpoint exist', async () => {
    await renderTest({
      nbVs: 1,
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[0].id),
    });

    const enpointTab = await waitFor(() =>
      screen.getByText(labels.dashboard.endpointsTabLabel),
    );

    await waitFor(() => userEvent.click(enpointTab));

    await assertTextVisibility(labels.endpoints.endpointsOnboardingTitle);
  });

  it('should display the endpoints listing if endpoint exist', async () => {
    await renderTest({
      nbVs: 2,
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[1].id),
    });

    const enpointTab = await waitFor(() =>
      screen.getByText(labels.dashboard.endpointsTabLabel),
    );

    await waitFor(() => userEvent.click(enpointTab));
    const urn =
      vrackServicesListMocks[1].currentState.subnets[0].serviceEndpoints[0]
        .managedServiceURN;
    const iamData = iamResourcesMocks.find((item) => item.urn === urn);

    await assertTextVisibility(
      labels.endpoints.endpointDatagridManagedServiceURNLabel,
    );
    await assertTextVisibility(iamData!.displayName);
    await assertTextVisibility(
      vrackServicesListMocks[1].currentState.subnets[0].serviceEndpoints[0]
        .endpoints[0].ip,
    );
  });

  it('should edit an enpoint', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });
    const urn =
      vrackServicesListMocks[1].currentState.subnets[0].serviceEndpoints[0]
        .managedServiceURN;
    const iamData = iamResourcesMocks.find((item) => item.urn === urn);

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      value: labels.endpoints['action-editServiceDisplayName'],
    });
    await waitFor(() => userEvent.click(editLink));

    await assertModalText({
      container,
      text: labels.endpoints.modalEndpointUpdateHeadline.replace(
        '{{name}}',
        iamData!.name,
      ),
    });

    await changeInputValueByLabelText({
      inputLabel: labels.endpoints.endpointUpdateDisplayNameInputLabel,
      value: 'new Name',
      nth: 1,
    });

    const submitButton = await getButtonByLabel({
      container,
      value: labels.actions.modify,
    });
    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it.skip('should delete an endpoint', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const deleteLink = await getButtonByLabel({
      container,
      value: labels.endpoints['action-deleteServiceEndpoint'],
    });
    await waitFor(() => userEvent.click(deleteLink));

    const deleteButton = await getButtonByLabel({
      container,
      value: labels.actions.delete,
    });
    await assertDisabled(deleteButton);

    await changeInputValueByLabelText({
      inputLabel: labels.endpoints.modalDeleteEndpointInputLabel,
      value: 'TERMINATE',
    });

    await assertEnabled(deleteButton);
    await waitFor(() => userEvent.click(deleteButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
