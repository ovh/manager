import { useNavigate, useParams } from 'react-router-dom';

import { getIamMocks } from '@key-management-service/mocks/iam/iam.handler';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { removeHandlersDelay } from '@/common/utils/tests/msw';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertBadgeColor } from '@/common/utils/tests/uiTestHelpers';

import { VersionIdCell } from './VersionCells.component';
import { VERSION_LIST_CELL_TEST_IDS } from './VersionCells.constants';

const mockOkmsId = 'test-okms-id';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

const renderVersionLink = async (versionMock: SecretVersion) => {
  // use global server to mock iam response
  global.server?.resetHandlers(...toMswHandlers(removeHandlersDelay([...getIamMocks({})])));

  const wrapper = await testWrapperBuilder().withQueryClient().withI18next().build();

  return render(<VersionIdCell version={versionMock} secret={mockSecret1} />, { wrapper });
};

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);
vi.mocked(useParams).mockReturnValue({
  okmsId: mockOkmsId,
  secretPath: mockSecret1.path,
});

describe('VersionCellId test suite', () => {
  type TestCase = {
    version: SecretVersion;
    isLinkDisabled: boolean;
  };

  const useCases: TestCase[] = [
    { version: versionActiveMock, isLinkDisabled: false },
    { version: versionDeactivatedMock, isLinkDisabled: true },
    { version: versionDeletedMock, isLinkDisabled: true },
  ];

  describe('Version link tests', () => {
    test.each(useCases)(
      'should render link for $version with param disabled: $isLinkDisabled',
      async ({ version, isLinkDisabled }) => {
        // given version

        // when
        await renderVersionLink(version);

        // then
        const link = await screen.findByText(version.id.toString());
        expect(link).toBeInTheDocument();
        if (isLinkDisabled) {
          expect(link).toHaveAttribute('disabled');
        } else {
          expect(link).not.toHaveAttribute('disabled');
        }
      },
    );
  });

  describe('current version tests', () => {
    const currentVersionMocked = versionActiveMock;
    const secretMocked = { ...mockSecret1, version: currentVersionMocked };

    beforeAll(() => {
      vi.mocked(useParams).mockReturnValue({
        okmsId: mockOkmsId,
        secretPath: secretMocked.path,
      });
    });

    test('should display a badge when version is the current version', async () => {
      // given

      // when
      const { getByTestId } = await renderVersionLink(currentVersionMocked);
      const badge = getByTestId(VERSION_LIST_CELL_TEST_IDS.currentVersionBadge);

      // then
      expect(badge).toBeInTheDocument();

      expect(badge).toHaveTextContent(labels.secretManager.current_version);
      assertBadgeColor(badge, 'information');
    });

    test('should not display a badge when version is not the current version', async () => {
      // given

      // when
      const { queryByTestId } = await renderVersionLink(versionDeactivatedMock);
      const badge = queryByTestId(VERSION_LIST_CELL_TEST_IDS.currentVersionBadge);

      // then
      expect(badge).toBeNull();
    });
  });
});
