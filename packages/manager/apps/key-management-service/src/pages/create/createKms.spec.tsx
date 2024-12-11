import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { catalogMock } from '@/mocks/catalog/catalog.mock';
import * as getKMSExpressOrderLink from '../../components/layout-helpers/Create/order-utils';

Object.assign(window, {
  open: vi.fn().mockImplementation(() => Promise.resolve()),
});

const mockedUrl = 'mocked-url';
vi.spyOn(getKMSExpressOrderLink, 'getKMSExpressOrderLink').mockReturnValue(
  mockedUrl,
);

describe('KMS creation page test suite', () => {
  it('should display the KMS creation page', async () => {
    await renderTestApp(`/${ROUTES_URLS.createKeyManagementService}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_subtitle,
          ),
        ).toBeVisible(),

      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.getByText(
        labels.create.key_management_service_create_region_title,
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
          screen.getByText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    expect(
      screen.getByText(labels.create.key_management_service_create_cta_cancel),
    ).toBeEnabled();

    expect(
      screen.getByText(labels.create.key_management_service_create_cta_order),
    ).toBeDisabled();
  });

  it(`should navigate back to the list on click on ${labels.create.key_management_service_create_cta_cancel}`, async () => {
    await renderTestApp(`/${ROUTES_URLS.createKeyManagementService}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_cta_cancel,
          ),
        ).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await userEvent.click(
      screen.getByText(labels.create.key_management_service_create_cta_cancel),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should display an error if the API is KO', async () => {
    await renderTestApp(`/${ROUTES_URLS.createKeyManagementService}`, {
      isCatalogOkmsKo: true,
    });

    await waitFor(
      () => expect(screen.getByAltText('OOPS')).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('should activate order button on region select', async () => {
    await renderTestApp(`/${ROUTES_URLS.createKeyManagementService}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => userEvent.click(screen.getByTestId('select-region')));

    await userEvent.click(
      screen.getByTestId(
        `select-region-option-${catalogMock.plans[0].configurations[0].values[0]}`,
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_cta_order,
          ),
        ).toBeEnabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});

describe('order KMS test suite', () => {
  beforeEach(async () => {
    await renderTestApp(`/${ROUTES_URLS.createKeyManagementService}`);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            labels.create.key_management_service_create_select_placeholder,
          ),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => userEvent.click(screen.getByTestId('select-region')));

    await waitFor(() =>
      userEvent.click(
        screen.getByTestId(
          `select-region-option-${catalogMock.plans[0].configurations[0].values[0]}`,
        ),
      ),
    );

    expect(
      screen.getByText(labels.create.key_management_service_create_cta_order),
    ).toBeEnabled();

    await waitFor(() =>
      userEvent.click(
        screen.getByText(labels.create.key_management_service_create_cta_order),
      ),
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
        labels.create.key_management_service_create_order_initiated_title,
      ),
    ).toBeVisible();

    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_subtitle,
      ),
    ).toBeVisible();

    expect(screen.getByText(mockedUrl)).toBeVisible();

    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_info,
      ),
    ).toBeVisible();

    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_cta_done,
      ),
    ).toBeVisible();
  });

  it('should open the order page on link click', async () => {
    expect(screen.getByText(mockedUrl)).toBeVisible();

    await userEvent.click(screen.getByText(mockedUrl));

    expect(window.open).toHaveBeenCalledWith(
      mockedUrl,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it(`should redirect to the listing page on click on ${labels.create.key_management_service_create_order_initiated_cta_done}`, async () => {
    expect(
      screen.getByText(
        labels.create.key_management_service_create_order_initiated_cta_done,
      ),
    ).toBeEnabled();

    await waitFor(() =>
      userEvent.click(
        screen.getByText(
          labels.create.key_management_service_create_order_initiated_cta_done,
        ),
      ),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.listing.key_management_service_listing_title),
        ).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });
});
