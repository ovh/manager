import React from 'react';
import RancherDetail from './RancherDetail';
import { render, waitFor, fireEvent } from '../../../utils/test/test.provider';
import { rancherMocked } from '../../../_mock_/rancher';
import { RancherService } from '../../../api/api.type';
import dashboardTranslation from '../../../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import listingTranslation from '../../../public/translations/pci-rancher/listing/Messages_fr_FR.json';

const setupSpecTest = async (rancherService: RancherService = rancherMocked) =>
  waitFor(() =>
    render(
      <RancherDetail
        rancher={rancherService}
        editNameResponse={null}
        editRancherName={jest.fn()}
        generateAccesDetail={jest.fn()}
        accessDetail={null}
        hasErrorAccessDetail={false}
      />,
    ),
  );

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
    const rancherVersionLabel = screen.getByText(
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

    const editNameModalTitle = screen.getByText(
      listingTranslation.editNameModalTitle,
    );

    expect(rancherName).not.toBeNull();
    expect(editNameModalTitle).not.toBeNull();
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
});
