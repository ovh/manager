import { useParams } from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

import { createErrorResponseMock, renderWithClient } from '@/common/utils/tests/testUtils';

import { BREADCRUMB_ITEM_TEST_IDS } from './BreadcrumbItem.constants';
import { OkmsBreadcrumbItem } from './OkmsBreadcrumbItem.component';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useParams: vi.fn(),
    useHref: vi.fn((link: string) => link),
  };
});

const mockedOkms: OKMS = okmsRoubaix1Mock;

const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
}));

vi.mocked(useParams).mockReturnValue({
  okmsId: mockedOkms.id,
});

describe('OkmsBreadcrumbItem test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should display okms displayname and have the correct href link', async () => {
    // GIVEN
    mockUseOkmsById.mockReturnValue({
      data: mockedOkms,
      isPending: false,
      error: null,
    });

    // WHEN
    renderWithClient(<OkmsBreadcrumbItem />);

    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.OKMS);
    const link = within(breadcrumbItem).getByRole('link');

    // THEN
    await waitFor(() => expect(link).toHaveTextContent(mockedOkms.iam.displayName));
    expect(link).toHaveAttribute('href', SECRET_MANAGER_ROUTES_URLS.secretList(mockedOkms.id));
  });

  it('should display okmsId when the api call fails', async () => {
    // GIVEN
    const mockError = createErrorResponseMock('OKMS error');
    mockUseOkmsById.mockReturnValue({
      data: null,
      isPending: false,
      error: mockError,
    });

    // WHEN
    renderWithClient(<OkmsBreadcrumbItem />);

    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.OKMS);
    const link = within(breadcrumbItem).getByRole('link');

    // THEN
    await waitFor(() => expect(link).toHaveTextContent(mockedOkms.id));
  });

  it('should display a skeleton while loading', async () => {
    // GIVEN
    mockUseOkmsById.mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });

    // WHEN
    renderWithClient(<OkmsBreadcrumbItem />);

    const breadcrumbItem = screen.getByTestId(BREADCRUMB_ITEM_TEST_IDS.OKMS_SKELETON);

    // THEN
    await waitFor(() => expect(breadcrumbItem).toBeVisible());
  });
});
