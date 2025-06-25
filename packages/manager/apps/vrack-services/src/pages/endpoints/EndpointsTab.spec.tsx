import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor, screen } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvent from '@testing-library/user-event';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { iamResourcesMocks } from '@/data/mocks/iam';
import {
  doActionOnElementUntil,
  getButtonByLabel,
  assertModalText,
  getButtonByIcon,
  labels,
  renderTest,
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

  it('should delete an endpoint', async () => {
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

    await assertModalText({
      container,
      text: labels.endpoints.modalDeleteEndpointDescription,
    });

    const deleteButton = await getButtonByLabel({
      container,
      value: labels.actions.delete,
    });

    await assertEnabled(deleteButton);
    const modal = container.querySelector('ods-modal');
    await doActionOnElementUntil(
      () => userEvent.click(deleteButton),
      () => expect(modal).not.toBeInTheDocument(),
    );
  });
});
