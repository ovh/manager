import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalVisibility,
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  assertModalTitle,
  changeInputValueByLabelText,
  getButtonByIcon,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';
import { iamResources } from '../../../mocks/iam/iam';
import { urls } from '@/routes/routes.constants';
import { IAM_ACTION } from '@/utils/iamActions.constants';

describe('Vrack Services endpoints page test suite', () => {
  it('should display the endpoints onboarding if no endpoint exist', async () => {
    await renderTest({
      nbVs: 1,
      initialRoute: urls.overview.replace(':id', vrackServicesList[0].id),
    });

    const enpointTab = await waitFor(() =>
      screen.getByText(labels.dashboard.endpointsTabLabel),
    );

    await waitFor(() => fireEvent.click(enpointTab));

    await assertTextVisibility(labels.endpoints.endpointsOnboardingTitle);
  });

  it('should display the endpoints listing if endpoint exist', async () => {
    await renderTest({
      nbVs: 2,
      initialRoute: urls.overview.replace(':id', vrackServicesList[1].id),
    });

    const enpointTab = await waitFor(() =>
      screen.getByText(labels.dashboard.endpointsTabLabel),
    );

    await waitFor(() => fireEvent.click(enpointTab));
    const urn =
      vrackServicesList[1].currentState.subnets[0].serviceEndpoints[0]
        .managedServiceURN;
    const iamData = iamResources.find((item) => item.urn === urn);

    await assertTextVisibility(
      labels.endpoints.endpointDatagridManagedServiceURNLabel,
    );
    await assertTextVisibility(iamData!.displayName);
    await assertTextVisibility(
      vrackServicesList[1].currentState.subnets[0].serviceEndpoints[0]
        .endpoints[0].ip,
    );
  });

  it('should edit a enpoint', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesList[1].id,
      ),
    });
    const urn =
      vrackServicesList[1].currentState.subnets[0].serviceEndpoints[0]
        .managedServiceURN;
    const iamData = iamResources.find((item) => item.urn === urn);

    const actionMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      label: labels.endpoints['action-editServiceDisplayName'],
    });

    await waitFor(() => fireEvent.click(editLink));

    await assertModalTitle({
      container,
      title: labels.endpoints.modalEndpointUpdateHeadline.replace(
        '{{name}}',
        iamData!.name,
      ),
    });

    await changeInputValueByLabelText({
      inputLabel: labels.endpoints.endpointUpdateDisplayNameInputLabel,
      value: 'new Name',
      number: 1,
    });

    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('should delete a endpoint', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesList[1].id,
      ),
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      label: labels.endpoints['action-deleteServiceEndpoint'],
    });

    await waitFor(() => fireEvent.click(editLink));

    await assertModalTitle({
      container,
      title: labels.endpoints.modalDeleteEndpointHeadline,
    });
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });
    await changeInputValueByLabelText({
      inputLabel: labels.endpoints.modalDeleteEndpointInputLabel,
      value: 'TERMINATE',
    });

    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('should disable edit service display name action if user have not the iam right to do it', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesList[1].id,
      ),
      unauthorizedActions: [IAM_ACTION.VRACK_SERVICES_RESOURCE_EDIT],
    });

    const actionMenu = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenu));

    await getButtonByLabel({
      container,
      label: labels.endpoints['action-editServiceDisplayName'],
      disabled: true,
    });
  });

  it('should disable delete service endpoint action if user have not the iam right to do it', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.endpointsListing.replace(
        ':id',
        vrackServicesList[1].id,
      ),
      unauthorizedActions: [IAM_ACTION.VRACK_SERVICES_RESOURCE_EDIT],
    });

    const actionMenu = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenu));

    await getButtonByLabel({
      container,
      label: labels.endpoints['action-deleteServiceEndpoint'],
      disabled: true,
    });
  });
});
