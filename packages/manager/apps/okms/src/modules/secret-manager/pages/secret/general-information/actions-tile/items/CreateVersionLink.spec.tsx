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

import { CREATE_VERSION_TEST_IDS, CreateVersionLink } from './CreateVersionLink.component';

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
    useHref: vi.fn((link: string) => link),
    useParams: () => ({ okmsId: OKMS_OK_MOCK.id }),
  };
});

const renderComponent = async () => {
  // use global server to mock iam response
  global.server?.resetHandlers(...toMswHandlers(removeHandlersDelay([...getIamMocks({})])));

  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return render(<CreateVersionLink secret={SECRET_MOCK} />, { wrapper });
};

describe('CreateVersionLink test suite', () => {
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
      expect(screen.getByTestId(CREATE_VERSION_TEST_IDS.skeleton)).toBeVisible();
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
      const link = screen.getByTestId(CREATE_VERSION_TEST_IDS.createVersionLink);

      await waitFor(() => {
        expect(link).not.toHaveAttribute('is-disabled');
      });
      expect(link).toHaveAttribute('label', labels.secretManager.add_new_version);
      expect(link).toHaveAttribute(
        'href',
        SECRET_MANAGER_ROUTES_URLS.secretCreateVersionDrawer(
          OKMS_OK_MOCK.id,
          SECRET_MOCK.path,
          SECRET_MOCK.metadata.currentVersion,
        ),
      );
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
      const link = screen.getByTestId(CREATE_VERSION_TEST_IDS.createVersionLink);

      await waitFor(() => {
        expect(link).toHaveAttribute('is-disabled', 'true');
      });
    });
  });
});
