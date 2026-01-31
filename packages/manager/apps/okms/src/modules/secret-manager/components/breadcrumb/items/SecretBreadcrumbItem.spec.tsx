import { useParams } from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';
import { SecretBreadcrumbItem } from './SecretBreadcrumbItem.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useParams: vi.fn(),
    useHref: vi.fn((link: string) => link),
  };
});

const mockedOkms: OKMS = okmsRoubaix1Mock;
const secretPath = 'secret~path';
const decodedSecretPath = 'secret/path';

vi.mocked(useParams).mockReturnValue({
  okmsId: mockedOkms.id,
  secretPath: secretPath,
});

// Mock decodeSecretPath
vi.mock('@secret-manager/utils/secretPath', async (importOriginal) => {
  const module = await importOriginal<typeof import('@secret-manager/utils/secretPath')>();
  return {
    ...module,
    decodeSecretPath: vi.fn(() => decodedSecretPath),
  };
});

describe('SecretBreadcrumbItem test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have the correct label and href link', async () => {
    // GIVEN
    // WHEN
    await renderWithI18n(<SecretBreadcrumbItem />);
    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.SECRET);
    const link = within(breadcrumbItem).getByRole('link');

    // THEN
    expect(link).toHaveTextContent(decodedSecretPath);
    expect(link).toHaveAttribute(
      'href',
      SECRET_MANAGER_ROUTES_URLS.secret(mockedOkms.id, secretPath),
    );
  });
});
