import { useParams } from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';
import { OkmsDashboardBreadcrumbItem } from './OkmsDashboardBreadcrumbItem.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useParams: vi.fn(),
    useHref: vi.fn((link: string) => link),
  };
});

const mockedOkms: OKMS = okmsRoubaix1Mock;

vi.mocked(useParams).mockReturnValue({
  okmsId: mockedOkms.id,
});

describe('OkmsDashboardBreadcrumbItem test suite', () => {
  it('should have the correct label and href link', async () => {
    // GIVEN
    // WHEN
    await renderWithI18n(<OkmsDashboardBreadcrumbItem />);
    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.OKMS_DASHBOARD);
    const link = within(breadcrumbItem).getByRole('link');

    // THEN
    expect(link).toHaveTextContent(labels.secretManager.okms_dashboard_title);
    expect(link).toHaveAttribute('href', SECRET_MANAGER_ROUTES_URLS.okmsDashboard(mockedOkms.id));
  });
});
