import userEvent from '@testing-library/user-event';
import React from 'react';
import { rancherPlan, rancherVersion } from '@/_mock_/rancher-resource';
import dashboardTranslation from '../../../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import listingTranslation from '../../../public/translations/pci-rancher/listing/Messages_fr_FR.json';
import { fireEvent, render, waitFor } from '../../../utils/test/test.provider';
import CreateRancher, { CreateRancherProps } from './CreateRancher';
import { getOnboardingUrl, getRanchersUrl } from '@/utils/route';

const onCreateRancher = jest.fn();
const mockedUsedNavigate = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
}));

const setupSpecTest = async (props?: Partial<CreateRancherProps>) =>
  waitFor(() =>
    render(
      <CreateRancher
        projectId="1234"
        onCreateRancher={onCreateRancher}
        plans={rancherPlan}
        versions={rancherVersion}
        hasRancherCreationError={false}
        isProjectDiscoveryMode={false}
        isCreateRancherLoading={false}
        {...props}
      />,
    ),
  );

describe('CreateRancher', () => {
  it("Given that I don't fill the name field, I shouldn't be able to create my Managed Rancher Service (CTA disabled)", async () => {
    const screen = await setupSpecTest();

    const button = screen.getByText(dashboardTranslation.createRancherCTA);

    await userEvent.click(button);

    expect(onCreateRancher).not.toHaveBeenCalled();
  });

  it("Given that name don't respect regex button should be disabled", async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('rancher-name-input');
    const button = screen.getByText(dashboardTranslation.createRancherCTA);

    fireEvent.change(input, { target: { value: '12()34343:::' } });
    await userEvent.click(button);

    expect(input).toHaveAttribute('color', 'error');
    expect(onCreateRancher).not.toHaveBeenCalled();
  });

  it('Given that I validate the creation of the service, i should call api with good default value', async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('rancher-name-input');
    const confirmButton = screen.getByText(
      dashboardTranslation.createRancherCTA,
    );

    const NEW_NAME = 'myrancher';
    fireEvent.change(input, { target: { value: NEW_NAME } });
    await userEvent.click(confirmButton);

    expect(onCreateRancher).toHaveBeenCalledWith({
      name: NEW_NAME,
      plan: 'STANDARD',
      version: 'v2.7.6',
    });
  });

  it("Given that I'm configuring the service, I should only have the Standard offer selected, and see the OVHcloud Edition card disabled with a Coming soon label on it.", async () => {
    const screen = await setupSpecTest();
    const standardPlan = screen.getByText(listingTranslation.STANDARD);

    expect(standardPlan).not.toBeNull();
  });

  it("Given that I'm configuring the service, I should have the recommanded version selected by default.", async () => {
    const screen = await setupSpecTest();
    const versionActive = screen.getByLabelText('tile-v2.7.6');

    expect(versionActive).not.toBeNull();

    // ODS attribute checked is not true sometime ..
    expect(versionActive).toHaveAttribute('checked');
  });

  it("Given that I'm configuring the service, I should only have the Standard offer selected, and see the OVHcloud Edition card disabled with a Coming soon label on it.", async () => {
    const screen = await setupSpecTest();
    const planActive = screen.getByLabelText('tile-Standard');

    expect(planActive).not.toBeNull();
    expect(planActive).toHaveAttribute('checked');
  });

  it('Given that there is an error i should see error banner.', async () => {
    const screen = await setupSpecTest({ hasRancherCreationError: true });
    const errorCreateBanner = screen.getByText(
      dashboardTranslation.createRancherError,
    );

    expect(errorCreateBanner).not.toBeNull();
  });

  describe('Cancel Click', () => {
    it('Given that I cancel the creation of the Rancher service, I should be redirected to the onboarding page.', async () => {
      const screen = await setupSpecTest();
      const cancelButton = screen.getByText(dashboardTranslation.cancel);

      await userEvent.click(cancelButton);

      expect(mockedUsedNavigate).toHaveBeenCalledWith(getOnboardingUrl('1234'));
    });

    it('Given that I cancel the creation of the Rancher service and i had some rancher, I should be redirected to the listing page.', async () => {
      const screen = await setupSpecTest({
        hasSomeRancher: true,
      });
      const cancelButton = screen.getByText(dashboardTranslation.cancel);

      await userEvent.click(cancelButton);

      expect(mockedUsedNavigate).toHaveBeenCalledWith(getRanchersUrl('1234'));
    });
  });

  describe('Discovery mode', () => {
    it('Given that I am in a Discovery project, I should not be able to click on the CTA to create a Rancher as it should be disable', async () => {
      const screen = await setupSpecTest({ isProjectDiscoveryMode: true });
      const button = screen.getByText(dashboardTranslation.createRancherCTA);

      const input = screen.getByLabelText('rancher-name-input');
      const confirmButton = screen.getByText(
        dashboardTranslation.createRancherCTA,
      );

      fireEvent.change(input, { target: { value: 'MyRancher' } });
      await userEvent.click(confirmButton);

      expect(onCreateRancher).not.toHaveBeenCalled();

      expect(button).toBeDisabled();
    });

    it('Given that I am in a Discovery project, I should see the yellow banner inviting me to activate my project', async () => {
      const screen = await setupSpecTest({ isProjectDiscoveryMode: true });
      const banner = screen.getByText(
        'Bien que le service soit gratuit durant la phase Beta',
        { exact: false },
      );

      expect(banner).not.toBeNull();
    });
  });
});
