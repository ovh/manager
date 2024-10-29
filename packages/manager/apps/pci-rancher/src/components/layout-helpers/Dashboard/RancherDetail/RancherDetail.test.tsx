import React from 'react';
import dashboardTranslation from '@translation/dashboard/Messages_fr_FR.json';
import updateTranslation from '@translation/updateSoftware/Messages_fr_FR.json';
import { versionsMocked } from '@/_mock_/version';
import { rancherMocked } from '@/_mock_/rancher';
import { ResourceStatus } from '@/types/api.type';

import { fireEvent, render, waitFor } from '@/utils/test/test.provider';
import RancherDetail, { RancherDetailProps } from './RancherDetail.component';

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

const updateOfferError = { class: 'error', message: 'error message' };

const defaultProps: RancherDetailProps = {
  updateOfferError,
  versions: versionsMocked,
  rancher: rancherMocked,
  editNameResponseType: null,
  hasErrorAccessDetail: false,
  updateSoftwareResponseType: null,
  updateOfferResponseType: null,
};
const setupSpecTest = async (props: RancherDetailProps = defaultProps) =>
  waitFor(() => render(<RancherDetail {...props} />));

describe('RancherDetail', () => {
  it("Given that I'm on the dashboard, I should see 3 tiles : General information, Consumption and Security and access.", async () => {
    const screen = await setupSpecTest();

    const generalInfo = screen.getByText(
      dashboardTranslation.general_informations,
    );
    const securityAndAccess = screen.getByText(
      dashboardTranslation.security_and_access,
    );

    expect(generalInfo).not.toBeNull();
    expect(securityAndAccess).not.toBeNull();
  });
  it("Given that I'm on the dashboard, I should see egressCidrBlocks", async () => {
    const screen = await setupSpecTest();

    const egressCidrBlocks = screen.getByText(
      dashboardTranslation.egress_title,
    );

    expect(egressCidrBlocks).not.toBeNull();
  });
  it("Given that I'm on the dashboard, I should see egressCIDR tooltip", async () => {
    const screen = await setupSpecTest();

    const egressToolTip = screen.getByText(dashboardTranslation.egress_tooltip);

    expect(egressToolTip).not.toBeNull();
  });
});

it('Given that the General info tab is displayed, it should contain the description and the version of the service I configured.', async () => {
  const screen = await setupSpecTest();

  const descriptionLabel = screen.getByText(dashboardTranslation.description);
  const rancherVersionLabel = screen.getAllByText(
    dashboardTranslation.rancher_version,
  );
  const rancherName = screen.getByText(rancherMocked.targetSpec.name);
  const rancherVersionValue = screen.getByText(
    rancherMocked.targetSpec.version,
  );

  expect(descriptionLabel).not.toBeNull();
  expect(rancherVersionLabel).not.toBeNull();
  expect(rancherName).not.toBeNull();
  expect(rancherVersionValue).not.toBeNull();
});

describe('Edit name', () => {
  it('Given that I can edit the name, I should be able to click on edit icon to get the right to change the name', async () => {
    const { getAllByText } = await setupSpecTest();

    const rancherName = getAllByText(rancherMocked.currentState.name);
    await fireEvent.click(rancherName[0]);

    expect(rancherName).not.toBeNull();
    const link = rancherName[0].closest('osds-link');

    expect(link).toHaveAttribute('href', '/edit');
    expect(link).not.toHaveAttribute('disabled');
  });

  it('Given that rancher is not ready i should not be able to edit the name', async () => {
    const { getAllByText } = await setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.UPDATING,
      },
    });

    const rancherName = getAllByText(rancherMocked.currentState.name);

    const link = rancherName[0].closest('osds-link');
    expect(link).toHaveAttribute('disabled');
  });
});

it('Given that the Consumption tile is displayed, it should contain the offer I configured, the nb of CPUs orchestrated and the last update date', async () => {
  const screen = await setupSpecTest();

  const descriptionLabel = screen.getByText(dashboardTranslation.consumption);
  const vcpus = screen.getByText(
    rancherMocked.currentState.usage?.orchestratedVcpus.toString() ?? '',
  );

  expect(descriptionLabel).not.toBeNull();
  expect(vcpus).not.toBeNull();
});

it('Given that the Security and access tile is displayed, it should contain the url to access the service and the button to generate the access', async () => {
  const screen = await setupSpecTest();

  const descriptionLabel = screen.getByText(
    dashboardTranslation.security_and_access,
  );
  const rancherUrlClipboard = screen.getByLabelText('clipboard');
  const rancherButtonAccess = screen.getByText(
    dashboardTranslation.rancher_button_acces,
  );

  expect(descriptionLabel).not.toBeNull();
  expect(rancherUrlClipboard.getAttribute('value')).toBe(
    rancherMocked.currentState.url,
  );
  expect(rancherButtonAccess).not.toBeNull();
});

describe('Update software', () => {
  it('Given that the update software is displayed, it should contain the version of the software and the button to update', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
    });

    const updateSoftwareLabel = screen.getByText(
      updateTranslation.updateSoftwareBannerAvailableUpdate,
    );

    const updateSoftwareButton = screen.getAllByText(
      updateTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).not.toBeNull();
    expect(updateSoftwareButton).not.toBeNull();
  });

  it('Given there is higher version but there is current update mutation, i should not see update  software banner', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      updateSoftwareResponseType: 'pending',
    });

    const updateSoftwareLabel = screen.queryByText(
      updateTranslation.updateSoftwareBannerAvailableUpdate.replaceAll(
        '{{version}}',
        versionsMocked[1].name,
      ),
    );
    const updateSoftwareButton = screen.queryByText(
      updateTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).toBeNull();
    expect(updateSoftwareButton).toBeNull();
  });

  it('Given there is higher version but rancher status is not status ready, i should not see update  software banner', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.UPDATING,
      },
    });

    const updateSoftwareLabel = screen.queryByText(
      updateTranslation.updateSoftwareBannerAvailableUpdate.replaceAll(
        '{{version}}',
        versionsMocked[1].name,
      ),
    );
    const updateSoftwareButton = screen.queryByText(
      updateTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).toBeNull();
    expect(updateSoftwareButton).toBeNull();
  });
  it('should render upgrade plan information when isEligibleForUpgrade is true', async () => {
    const screen = await setupSpecTest();

    const upgradePlanTitle = screen.getByText(
      dashboardTranslation.upgradePlanTitle,
    );
    const upgradePlanDescription = screen.getByText(
      dashboardTranslation.upgradePlanDescription,
    );
    const upgradePlanButton = screen.getByText(
      dashboardTranslation.upgradePlanButton,
    );

    expect(upgradePlanTitle).toBeInTheDocument();
    expect(upgradePlanDescription).toBeInTheDocument();
    expect(upgradePlanButton).toBeInTheDocument();

    const linkIcon = screen.getByText(dashboardTranslation.upgradePlanButton);
    expect(linkIcon).not.toBeDisabled();
  });
});
