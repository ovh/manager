import { getIamMocks } from '@key-management-service/mocks/iam/iam.handler';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { removeHandlersDelay } from '@/common/utils/tests/msw';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { ADD_VERSION_BUTTON_TEST_ID, AddVersionButton } from './AddVersionButton.component';

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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => mockNavigate,
    useHref: vi.fn((link: string) => link),
  };
});

const renderComponent = async () => {
  // use global server to mock iam response
  global.server?.resetHandlers(...toMswHandlers(removeHandlersDelay([...getIamMocks({})])));

  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return render(<AddVersionButton okmsId={okmsRoubaix1Mock.id} secret={SECRET_MOCK} />, {
    wrapper,
  });
};

describe('CreateVersionLink test suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data is loading', () => {
    it('should display a loader', async () => {
      // GIVEN mocked OKMS
      mockUseOkmsById.mockReturnValueOnce({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });

      // WHEN
      await renderComponent();

      // THEN
      const button = screen.getByTestId(ADD_VERSION_BUTTON_TEST_ID);

      expect(button).toBeVisible();
      expect(button).toHaveAttribute('is-loading', 'true');
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

      await waitFor(() => {
        const button = screen.getByTestId(ADD_VERSION_BUTTON_TEST_ID);
        // expect(button).not.toHaveAttribute('disabled');
        expect(button).toHaveAttribute('is-disabled', 'false');
        expect(button).toHaveAttribute('label', labels.secretManager.add_new_version);
      });
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
      const button = screen.getByTestId(ADD_VERSION_BUTTON_TEST_ID);

      await waitFor(() => {
        expect(button).toHaveAttribute('disabled');
      });
    });

    it('should navigate to create version drawer on click', async () => {
      const user = userEvent.setup();

      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_OK_MOCK,
        isPending: false,
        error: null,
      });

      const expectedLink = SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
        OKMS_OK_MOCK.id,
        SECRET_MOCK.path,
        SECRET_MOCK.metadata.currentVersion,
      );

      // WHEN
      await renderComponent();

      await waitFor(() => {
        const button = screen.getByTestId(ADD_VERSION_BUTTON_TEST_ID);
        expect(button).toHaveAttribute('is-disabled', 'false');
      });

      const button = screen.getByTestId(ADD_VERSION_BUTTON_TEST_ID);

      await act(async () => user.click(button));

      // THEN
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expectedLink);
      });
    });
  });
});
