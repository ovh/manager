import userEvent from '@testing-library/user-event';
import React from 'react';
import { rancherPlan, rancherVersion } from '@/_mock_/rancher-resource';
import dashboardTranslation from '../../../public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import { render, waitFor } from '../../../utils/test/test.provider';
import CreateRancher, { CreateRancherProps } from './CreateRancher';

const onCreateRancher = jest.fn();
const mockedUsedNavigate = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
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

    await userEvent.type(input, '12()34343:::');
    await userEvent.click(button);

    expect(input).toHaveAttribute('color', 'error');
    expect(onCreateRancher).not.toHaveBeenCalled();
  });

  it('Given that I validate the creation of the service, I should be redirected to the product listing page and see the status of the service in the datagrid and success banner', async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('rancher-name-input');
    const confirmButton = screen.getByText(
      dashboardTranslation.createRancherCTA,
    );

    await userEvent.type(input, 'MyRancher');
    await userEvent.click(confirmButton);

    expect(onCreateRancher).toHaveBeenCalledWith({
      name: 'MyRancher',
      plan: 'STANDARD',
      version: 'v2.7.6',
    });
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/pci/projects/1234/rancher',
    );
  });

  it("Given that I'm configuring the service, I should only have the Standard offer selected, and see the OVHcloud Edition card disabled with a Coming soon label on it.", async () => {
    const screen = await setupSpecTest();
    const standardPlan = screen.getByText('STANDARD');

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
    const planActive = screen.getByLabelText('tile-STANDARD');

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
  it('Given that I cancel the creation of the Rancher service, I should be redirected to the onboarding page.', async () => {
    const screen = await setupSpecTest();
    const cancelButton = screen.getByText(dashboardTranslation.cancel);

    await userEvent.click(cancelButton);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/pci/projects/1234/rancher/onboarding',
    );
  });
});
