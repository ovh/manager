import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';
import { CreateSecretBreadcrumbItem } from './CreateSecretBreadcrumbItem.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useHref: vi.fn((link: string) => link),
  };
});

describe('CreateSecretBreadcrumbItem test suite', () => {
  it('should have the correct label and href link', async () => {
    // GIVEN
    // WHEN
    await renderWithI18n(<CreateSecretBreadcrumbItem />);
    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.CREATE_SECRET);
    const link = within(breadcrumbItem).getByRole('link');

    // THEN
    expect(link).toHaveTextContent(labels.secretManager.create_a_secret);
    expect(link).toHaveAttribute('href', SECRET_MANAGER_ROUTES_URLS.createSecret);
  });
});
