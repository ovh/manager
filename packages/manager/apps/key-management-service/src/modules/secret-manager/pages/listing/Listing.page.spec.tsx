import { screen, act } from '@testing-library/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { secretsMock } from '@secret-manager/mocks/secrets/secrets.mock';
import userEvent from '@testing-library/user-event';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

const mockOkmsId = '12345';
const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretListing(mockOkmsId);

const renderPage = async () => {
  const { container } = await renderTestApp(mockPageUrl);

  // Check title
  expect(
    await screen.findByText(labels.secretManager.common.secret_manager),
  ).toBeVisible();

  return { container };
};

describe('Secrets listing test suite', () => {
  it('should display the secrets listing page', async () => {
    await renderPage();
  });

  it('should display the listing table with all columns', async () => {
    await renderPage();

    const tableHeaders = [
      labels.secretManager.common.path,
      labels.secretManager.common.version,
      labels.common.dashboard.creation_date,
    ];

    tableHeaders.forEach((header) => {
      expect(screen.queryAllByText(header)).toHaveLength(1);
    });
  });

  it('should navigate to a secret detail page on click on secret path', async () => {
    const user = userEvent.setup();
    const { container } = await renderPage();

    const secretPageLink = await getOdsButtonByLabel({
      container,
      label: secretsMock[0].path,
      isLink: true,
    });

    await act(() => user.click(secretPageLink));

    const dashboardPageLabels = await screen.findAllByText(
      labels.secretManager.dashboard.general_information,
      {},
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    expect(dashboardPageLabels.length).toBeGreaterThan(0);
  });
});
