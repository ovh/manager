import userEvent from '@testing-library/user-event';
import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  rancherPlan,
  rancherVersion,
  rancherPlansPricing,
} from '@/_mock_/rancher-resource';
import dashboardTranslation from '../../../../public/translations/dashboard/Messages_fr_FR.json';
import listingTranslation from '../../../../public/translations/listing/Messages_fr_FR.json';
import {
  act,
  fireEvent,
  render,
  waitFor,
} from '../../../utils/test/test.provider';

import { getRanchersUrl } from '@/utils/route';
import CreateRancher, { CreateRancherProps } from './CreateRancher.component';

const onCreateRancher = jest.fn();
const mockedUsedNavigate = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

jest.mock('@ovh-ux/manager-react-components', () => ({
  ...jest.requireActual('@ovh-ux/manager-react-components'),
  Subtitle: jest.fn(),
  Title: jest.fn(),
  useCatalogPrice: jest.fn(() => ({
    getFormattedHourlyCatalogPrice: jest.fn(() => 0.0171),
    getFormattedMonthlyCatalogPrice: jest.fn(() => 12.312),
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: jest.fn(() => ({ data: {} })),
  PciDiscoveryBanner: jest.fn(
    () => 'pci_projects_project_activate_project_banner_message',
  ),
  usePciUrl: jest.fn(() => '/url'),
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
        pricing={rancherPlansPricing}
        {...props}
      />,
    ),
  );

describe('CreateRancher', () => {
  it("Given that I don't fill the name field, I shouldn't be able to create my Managed Rancher Service (CTA disabled)", async () => {
    const screen = await setupSpecTest();
    const button = screen.getByText(dashboardTranslation.createRancherCTA);
    userEvent.click(button);
    expect(onCreateRancher).not.toHaveBeenCalled();
  });

  it("Given that name don't respect regex button should be disabled", async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('rancher-name-input');
    const button = screen.getByText(dashboardTranslation.createRancherCTA);

    await act(async () => {
      fireEvent.change(input, { target: { value: '12()34343:::' } });
    });
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
    await act(async () => {
      fireEvent.change(input, { target: { value: NEW_NAME } });
    });
    await userEvent.click(confirmButton);

    expect(onCreateRancher).toHaveBeenCalledWith({
      name: NEW_NAME,
      plan: 'STANDARD',
      version: 'v2.7.6',
    });
  });

  it("Given that I'm configuring the service, I should have the standard edition offer selected", async () => {
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

  it('Given that there is an error i should see error banner.', async () => {
    const screen = await setupSpecTest({
      hasRancherCreationError: true,
      rancherCreationErrorMessage: {
        class: 'Client::BadRequest',
        message:
          'Une erreur est survenue lors de la création de votre Managed Rancher Service.',
      },
    });
    const errorCreateBanner = screen.getByTestId('errorBanner');
    expect(errorCreateBanner).toHaveTextContent(
      'Une erreur est survenue lors de la création de votre Managed Rancher Service.',
    );
  });

  it('Given that there is prices I should see rancher pricing', async () => {
    const screen = await setupSpecTest();
    const rancherPricingHourly = screen.getAllByText('0.0171');
    const rancherPricingMonthly = screen.getAllByText('~ 12.312');

    expect(rancherPricingMonthly).not.toBeNull();
    expect(rancherPricingHourly).not.toBeNull();
  });

  describe('Cancel Click', () => {
    it('Given that I cancel the creation of the Rancher service and i had some rancher, I should be redirected to the listing page.', async () => {
      const screen = await setupSpecTest({});
      const cancelButton = screen.getByText(dashboardTranslation.cancel);

      userEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith(getRanchersUrl('1234'));
      });
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

      await act(async () => {
        fireEvent.change(input, { target: { value: 'MyRancher' } });
      });
      await userEvent.click(confirmButton);

      expect(onCreateRancher).not.toHaveBeenCalled();

      expect(button).toBeDisabled();
    });

    it('Given that I am in a Discovery project, I should see the yellow banner inviting me to activate my project', async () => {
      const screen = await setupSpecTest({ isProjectDiscoveryMode: true });
      const banner = screen.getByText(
        'pci_projects_project_activate_project_banner_message',
      );

      expect(banner).not.toBeNull();
    });

    it('Given that I have the selected version null and the versions available, I should see the selected version to the available version with the highest name with the recommanded version description', async () => {
      const screen = await setupSpecTest();
      const versionActive = screen.getByLabelText('tile-v2.7.6');

      expect(versionActive).not.toBeNull();
      expect(versionActive).toHaveAttribute('checked');

      const recommendedText =
        dashboardTranslation.createRancherRecomendedVersion;

      const childrenWithRecommendedText = Array.from(
        versionActive.querySelectorAll('*'),
      ).some((child) => child.textContent.includes(recommendedText));

      expect(childrenWithRecommendedText).toBe(true);
    });

    it('Given that I have the selected version null and the versions available, I should see  the available version with other names than the highest name without the recommanded version description', async () => {
      const screen = await setupSpecTest();
      const versionNotActive = screen.getByLabelText('tile-v2.7.4');

      expect(versionNotActive).not.toBeNull();
      expect(versionNotActive).not.toHaveAttribute('checked');

      const recommendedText =
        dashboardTranslation.createRancherRecomendedVersion;

      const childrenWithRecommendedText = Array.from(
        versionNotActive.querySelectorAll('*'),
      ).some((child) => child.textContent.includes(recommendedText));

      expect(childrenWithRecommendedText).toBe(false);
    });
  });

  it('Given that I am typing the rancher name, I should see the helper text in the correct color based on the Rancher name validity', async () => {
    const screen = await setupSpecTest();

    const input = screen.getByLabelText('rancher-name-input');
    const helperText = screen.getByText(
      dashboardTranslation.createNameModaleHelperInput,
    );

    expect(helperText).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.text);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Invalid Name!' } });
    });
    await waitFor(() => {
      expect(helperText).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.error);
    });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'valid-name' } });
    });
    await waitFor(() => {
      expect(helperText).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.text);
    });
  });
});
