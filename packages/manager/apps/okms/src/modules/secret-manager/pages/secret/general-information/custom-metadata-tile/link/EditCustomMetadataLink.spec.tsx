import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { OKMS } from '@key-management-service/types/okms.type';
import { mockSecret1, mockSecret3 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { EDIT_CUSTOM_METADATA_LINK_TEST_IDS } from '../CustomMetadataTile.constants';
import { EditCustomMetadataLink } from './EditCustomMetadataLink.component';

const SECRET_WITH_CUSTOM_METADATA_MOCK = mockSecret1;
const SECRET_WITHOUT_CUSTOM_METADATA_MOCK = mockSecret3;
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

const renderComponent = async (secret = SECRET_WITH_CUSTOM_METADATA_MOCK) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();

  return render(<EditCustomMetadataLink secret={secret} />, { wrapper });
};

describe('EditCustomMetadataLink test suite', () => {
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
      expect(screen.getByTestId(EDIT_CUSTOM_METADATA_LINK_TEST_IDS.skeleton)).toBeVisible();
    });
  });

  describe('when okms domain status is not OK', () => {
    it('should be disabled', async () => {
      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_EXPIRED_MOCK,
        isPending: false,
        error: null,
      });

      // WHEN
      await renderComponent();

      // THEN
      const link = screen.getByTestId(EDIT_CUSTOM_METADATA_LINK_TEST_IDS.editCustomMetadataLink);

      await waitFor(() => {
        expect(link).toHaveAttribute('disabled');
      });
    });
  });

  describe('when okms domain status is OK', () => {
    it('should show edit text when customMetadata exists', async () => {
      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_OK_MOCK,
        isPending: false,
        error: null,
      });

      // WHEN
      await renderComponent(SECRET_WITH_CUSTOM_METADATA_MOCK);

      // THEN
      const link = screen.getByTestId(EDIT_CUSTOM_METADATA_LINK_TEST_IDS.editCustomMetadataLink);

      await waitFor(() => {
        expect(link).not.toHaveAttribute('is-disabled');
      });
      expect(link).toHaveTextContent(labels.secretManager.edit_custom_metadata);
      expect(link).toHaveAttribute(
        'href',
        SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
          OKMS_OK_MOCK.id,
          SECRET_WITH_CUSTOM_METADATA_MOCK.path,
        ),
      );
    });

    it('should show add text when customMetadata does not exist', async () => {
      // GIVEN
      mockUseOkmsById.mockReturnValueOnce({
        data: OKMS_OK_MOCK,
        isPending: false,
        error: null,
      });

      // WHEN
      await renderComponent(SECRET_WITHOUT_CUSTOM_METADATA_MOCK);

      // THEN
      const link = screen.getByTestId(EDIT_CUSTOM_METADATA_LINK_TEST_IDS.editCustomMetadataLink);

      await waitFor(() => {
        expect(link).not.toHaveAttribute('is-disabled');
      });
      expect(link).toHaveTextContent(labels.secretManager.add_custom_metadata);
      expect(link).toHaveAttribute(
        'href',
        SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
          OKMS_OK_MOCK.id,
          SECRET_WITHOUT_CUSTOM_METADATA_MOCK.path,
        ),
      );
    });
  });
});
