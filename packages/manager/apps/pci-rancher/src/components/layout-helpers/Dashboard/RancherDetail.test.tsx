import React from 'react';
import { versionsMocked } from '@/_mock_/version';
import { rancherMocked } from '@/_mock_/rancher';
import { ResourceStatus } from '@/api/api.type';
import dashboardTranslation from '@/public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import updateTranslation from '@/public/translations/pci-rancher/updateSoftware/Messages_fr_FR.json';

import { fireEvent, render, waitFor } from '@/utils/test/test.provider';
import RancherDetail, { RancherDetailProps } from './RancherDetail';

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

const defaultProps: RancherDetailProps = {
  latestVersionAvailable: null,
  rancher: rancherMocked,
  editNameResponseType: null,
  hasErrorAccessDetail: false,
  updateSoftwareResponseType: null,
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

  it('Given that I can edit the name, I should be able to click on edit icon to get the right to change the name', async () => {
    const screen = await setupSpecTest();

    const rancherName = screen.getByLabelText('edit');
    await fireEvent.click(rancherName);

    expect(rancherName).not.toBeNull();

    expect(screen.getByLabelText('edit-link')).toHaveAttribute('href', '/edit');
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
        latestVersionAvailable: versionsMocked[1],
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
        latestVersionAvailable: versionsMocked[1],
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
        latestVersionAvailable: versionsMocked[1],
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
  });
});
