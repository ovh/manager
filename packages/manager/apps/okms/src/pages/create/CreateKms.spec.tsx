import { act, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import { locationsMock } from '@/modules/secret-manager/mocks/locations/locations.mock';
import kmsListingTestIds from '../listing/KmsListing.constants';
import { getCatalogKmsErrorMessage } from '@/mocks/catalog/catalog.handler';
import * as useGetOkmsOrderLink from './useGetOkmsOrderLink';

Object.assign(window, {
  open: vi.fn().mockImplementation(() => Promise.resolve()),
});

const mockedUrl = 'mocked-order-url';
const mockedGetOrderLink = () => mockedUrl;
vi.spyOn(useGetOkmsOrderLink, 'useGetOkmsOrderLink').mockReturnValue({
  getOrderLink: mockedGetOrderLink,
});

const mrcCancelButtonTestId = 'cta-order-configuration-cancel';
const mrcOrderButtonTestId = 'cta-order-configuration-order';
const mrcFinishButtonTestId = 'cta-order-summary-finish';

const regionListMock = catalogMock.plans[0].configurations[0].values;
const firstRegionMock = locationsMock.find(
  (location) => location.name === regionListMock[0],
);
const firstRegionNameMock = firstRegionMock?.location || '';

describe('KMS creation page test suite', () => {
  it('should display the KMS creation page', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await assertTextVisibility(
      labels.create.key_management_service_create_title,
    );
    await assertTextVisibility(labels.create.region_selection);
    await assertTextVisibility(labels.create.region_selection_description);

    await assertTextVisibility(firstRegionNameMock);

    expect(screen.getByTestId(mrcCancelButtonTestId)).toBeEnabled();
    expect(screen.getByTestId(mrcOrderButtonTestId)).toBeDisabled();
  });

  it(`should navigate back to the list on click on ${labels.create.key_management_service_create_cta_cancel}`, async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    const cancelButton = await getOdsButtonByLabel({
      container,
      label: labels.create.key_management_service_create_cta_cancel,
    });

    await act(() => user.click(cancelButton));

    expect(await screen.findByTestId(kmsListingTestIds.ctaOrder)).toBeVisible();
  });

  it('should display an error if the API is KO', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate, {
      isCatalogOkmsKo: true,
    });

    await assertTextVisibility(getCatalogKmsErrorMessage);
  });

  it('should activate order button on region select', async () => {
    const user = userEvent.setup();
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await assertTextVisibility(firstRegionNameMock);

    const firstRegionOption = screen.getByText(firstRegionNameMock);

    await act(() => user.click(firstRegionOption));

    await waitFor(() => {
      expect(screen.getByTestId(mrcOrderButtonTestId)).toBeEnabled();
    });
  });
});

const renderAndInitiateOrder = async () => {
  const user = userEvent.setup();
  await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

  // Pick a region
  await assertTextVisibility(firstRegionNameMock);

  const firstRegionOption = screen.getByText(firstRegionNameMock);

  await act(() => user.click(firstRegionOption));

  // Click on order button
  await waitFor(() => {
    expect(screen.getByTestId(mrcOrderButtonTestId)).toBeEnabled();
  });

  await act(() => {
    user.click(screen.getByTestId(mrcOrderButtonTestId));
  });

  // Wait for the order confirmation page to be displayed
  await waitFor(() =>
    expect(screen.getByTestId(mrcFinishButtonTestId)).toBeVisible(),
  );
};

describe('order KMS test suite', () => {
  it('should display the order confirmation page', async () => {
    await renderAndInitiateOrder();

    expect(screen.getByTestId(mrcFinishButtonTestId)).toBeVisible();
  });

  it('should open the order page on a new tab on page load', async () => {
    await renderAndInitiateOrder();

    expect(window.open).toHaveBeenCalledWith(
      mockedUrl,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it(`should navigate to the listing page on click on "Terminé"`, async () => {
    await renderAndInitiateOrder();

    const ctaFinish = screen.getByTestId(mrcFinishButtonTestId);
    expect(ctaFinish).toBeEnabled();

    await act(() => userEvent.click(ctaFinish));

    expect(await screen.findByTestId(kmsListingTestIds.ctaOrder)).toBeVisible();
  });
});
