import { act, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  selectOdsSelectOption,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import * as getKMSExpressOrderLink from '../../components/layout-helpers/Create/order-utils';
import kmsListingTestIds from '../listing/KmsListing.constants';
import { CREATE_KMS_TEST_IDS } from './createKms.constants';

Object.assign(window, {
  open: vi.fn().mockImplementation(() => Promise.resolve()),
});

const mockedUrl = 'mocked-url';
vi.spyOn(getKMSExpressOrderLink, 'getKMSExpressOrderLink').mockReturnValue(
  mockedUrl,
);

describe('KMS creation page test suite', () => {
  it('should display the KMS creation page', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_region_title,
          ),
        ).toBeVisible(),

      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.getByText(
        labels.create.key_management_service_create_region_description,
      ),
    ).toBeVisible();

    expect(
      screen.getByText(
        labels.create.key_management_service_create_region_description,
      ),
    ).toBeVisible();

    await waitFor(
      () =>
        expect(
          screen.getByPlaceholderText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCancel)).toBeEnabled();
    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCreate)).toBeDisabled();
  });

  it(`should navigate back to the list on click on ${labels.create.key_management_service_create_cta_cancel}`, async () => {
    const user = userEvent.setup();
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await waitFor(
      () =>
        expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCancel)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await act(() => {
      user.click(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCancel));
    });

    await waitFor(
      () =>
        expect(screen.getByTestId(kmsListingTestIds.ctaOrder)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display an error if the API is KO', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate, {
      isCatalogOkmsKo: true,
    });

    await waitFor(
      () =>
        expect(
          screen.getByTestId(CREATE_KMS_TEST_IDS.catalogError),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should activate order button on region select', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await waitFor(
      () =>
        expect(
          screen.getByPlaceholderText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    selectOdsSelectOption({
      testId: CREATE_KMS_TEST_IDS.selectRegion,
      value: catalogMock.plans[0].configurations[0].values[0],
    });

    await waitFor(
      () =>
        expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCreate)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});

describe('order KMS test suite', () => {
  beforeEach(async () => {
    const user = userEvent.setup();
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await waitFor(
      () =>
        expect(
          screen.getByPlaceholderText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    selectOdsSelectOption({
      testId: CREATE_KMS_TEST_IDS.selectRegion,
      value: catalogMock.plans[0].configurations[0].values[0],
    });

    await waitFor(
      () =>
        expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCreate)).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await act(() => {
      user.click(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaCreate));
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_order_initiated_title,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should open the order page on a new tab on page load', async () => {
    expect(window.open).toHaveBeenCalledWith(
      mockedUrl,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should display the order confirmation page', async () => {
    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_subtitle,
      ),
    ).toBeVisible();

    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.orderLink)).toBeVisible();

    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_info,
      ),
    ).toBeVisible();

    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.ctaFinish)).toBeVisible();
  });

  it('should open the order page on link click', async () => {
    const link = screen.getByTestId(CREATE_KMS_TEST_IDS.orderLink);
    expect(link).toBeVisible();

    await userEvent.click(link);

    expect(window.open).toHaveBeenCalledWith(
      mockedUrl,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it(`should redirect to the listing page on click on ${labels.create.key_management_service_create_order_initiated_cta_done}`, async () => {
    const ctaDone = screen.getByTestId(CREATE_KMS_TEST_IDS.ctaFinish);
    expect(ctaDone).toBeEnabled();

    await waitFor(() => userEvent.click(ctaDone));

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
