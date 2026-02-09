import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { vi } from 'vitest';

import { getCatalogKmsErrorMessage } from '@/common/mocks/catalog/catalog.handler';
import { catalogMock } from '@/common/mocks/catalog/catalog.mock';
import { locationsMock } from '@/common/mocks/locations/locations.mock';
import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';
import { assertTitleVisibility } from '@/common/utils/tests/uiTestHelpers';

import { CREATE_KMS_TEST_IDS } from './CreateKms.constants';

// ----- MOCKS ----- //

Object.assign(window, {
  open: vi.fn().mockImplementation(() => Promise.resolve()),
});

// mock on react-router navigate
const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => navigate,
  };
});

const regionListMock = catalogMock.plans[0]?.configurations[0]?.values;
const firstRegionMock = locationsMock.find((location) => location.name === regionListMock?.[0]);
const firstRegionNameMock = firstRegionMock?.location || '';

if (!firstRegionMock || !firstRegionNameMock) {
  throw new Error('First region not found');
}

// ----- HELPERS ----- //

const pickRegion = async (user: UserEvent) => {
  const firstRegionOption = await screen.findByText(firstRegionNameMock);
  await act(() => user.click(firstRegionOption));
};

const expectOrderButtonToBeEnabled = async () => {
  await waitFor(() => {
    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.CTA_ORDER)).toBeEnabled();
  });
};

// ----- TESTS ----- //

describe('KMS creation page test suite', () => {
  it('should display the KMS creation page', async () => {
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await assertTitleVisibility({
      title: labels.create.key_management_service_create_title,
      level: 1,
    });
    await assertTextVisibility(labels.create.region_selection);
    await assertTextVisibility(labels.create.region_selection_description);

    await assertTextVisibility(firstRegionNameMock);

    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.CTA_CANCEL)).toBeEnabled();
    expect(screen.getByTestId(CREATE_KMS_TEST_IDS.CTA_ORDER)).toBeDisabled();
  });

  it(`should navigate back to the list on click on ${labels.create.key_management_service_create_cta_cancel}`, async () => {
    const user = userEvent.setup();
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    const cancelButton = screen.getByRole('button', {
      name: labels.create.key_management_service_create_cta_cancel,
    });

    await act(async () => await user.click(cancelButton));

    expect(navigate).toHaveBeenCalledWith(KMS_ROUTES_URLS.kmsListing);
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

    await pickRegion(user);

    await expectOrderButtonToBeEnabled();
  });

  it('should open the order modal on order button click', async () => {
    const user = userEvent.setup();
    await renderTestApp(KMS_ROUTES_URLS.kmsCreate);

    await pickRegion(user);

    await expectOrderButtonToBeEnabled();

    // Click on order button
    await act(async () => {
      await user.click(screen.getByTestId(CREATE_KMS_TEST_IDS.CTA_ORDER));
    });

    // Wait for the order modal page to be displayed
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith(
        KMS_ROUTES_URLS.kmsCreateOrderModal(firstRegionMock.name),
      ),
    );
  });
});
