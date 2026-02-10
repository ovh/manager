import { getIamMocks } from '@key-management-service/mocks/iam/iam.handler';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { removeHandlersDelay } from '@/common/utils/tests/msw';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { EDIT_METADATA_LINK_TEST_IDS, EditMetadataLink } from './EditMetadataLink.component';

const SECRET_MOCK = mockSecret1;
const OKMS_OK_MOCK = okmsRoubaix1Mock;
const OKMS_EXPIRED_MOCK: OKMS = {
  ...okmsRoubaix1Mock,
  iam: { ...okmsRoubaix1Mock.iam, state: 'EXPIRED' },
};

const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useParams: () => ({ okmsId: OKMS_OK_MOCK.id }),
  };
});

const renderComponent = async () => {
  // use global server to mock iam response
  global.server?.resetHandlers(...toMswHandlers(removeHandlersDelay([...getIamMocks({})])));

  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return render(<EditMetadataLink secret={SECRET_MOCK} />, { wrapper });
};

describe('EditMetadataLink test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data is loading', () => {
    it('should display a skeleton', async () => {
      // GIVEN mocked OKMS
      mockUseOkmsById.mockReturnValueOnce({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });

      // WHEN
      await renderComponent();

      // THEN
      expect(screen.getByTestId(EDIT_METADATA_LINK_TEST_IDS.skeleton)).toBeVisible();
    });
  });

  describe('When okms is loaded', () => {
    it('should be enabled when OKMS domain status is OK, with correct parameters', async () => {
      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_OK_MOCK,
        isPending: false,
        error: null,
      });

      // WHEN
      await renderComponent();

      // THEN
      const link = screen.getByTestId(EDIT_METADATA_LINK_TEST_IDS.editMetadataLink);

      await waitFor(() => {
        expect(link).not.toHaveAttribute('disabled');
      });
      expect(link).toHaveTextContent(labels.secretManager.edit_metadata);
      const expectedHref = SECRET_MANAGER_ROUTES_URLS.secretEditMetadataDrawer(
        OKMS_OK_MOCK.id,
        SECRET_MOCK.path,
      );
      expect(link.getAttribute('to')).toBe(expectedHref);
    });

    it('should be disabled when OKMS domain status is not OK', async () => {
      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_EXPIRED_MOCK,
        isPending: false,
        error: null,
      });

      // WHEN
      await renderComponent();

      // THEN
      const link = screen.getByTestId(EDIT_METADATA_LINK_TEST_IDS.editMetadataLink);

      await waitFor(() => {
        expect(link).toHaveAttribute('disabled');
      });
    });
  });
});
