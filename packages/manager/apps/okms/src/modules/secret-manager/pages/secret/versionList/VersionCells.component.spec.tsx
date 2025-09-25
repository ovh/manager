import React from 'react';
import { i18n } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it } from 'vitest';
import {
  getOdsButtonByLabel,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { SecretVersion } from '@secret-manager/types/secret.type';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { removeHandlersDelay, renderWithClient } from '@/utils/tests/testUtils';
import { VersionIdCell } from './VersionCells.component';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import { getIamMocks } from '@/mocks/iam/iam.handler';
import { VERSION_LIST_CELL_TEST_IDS } from './VersionCells.constants';

let i18nValue: i18n;

const mockOkmsId = 'test-okms-id';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

const renderVersionLink = async (versionMock: SecretVersion) => {
  // use global server to mock iam response
  global.server?.resetHandlers(
    ...toMswHandlers(removeHandlersDelay([...getIamMocks({})])),
  );

  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  const { container } = renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <VersionIdCell version={versionMock} secret={mockSecret1} />
    </I18nextProvider>,
  );

  return { container };
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

  const testCases: TestCase[] = [
    { version: versionActiveMock, isLinkDisabled: false },
    { version: versionDeactivatedMock, isLinkDisabled: true },
    { version: versionDeletedMock, isLinkDisabled: true },
  ];

  describe('Version link tests', () => {
    it.each(testCases)(
      'should render link for $version with param disabled: $isLinkDisabled',
      async ({ version, isLinkDisabled }) => {
        // GIVEN version

        // WHEN
        const { container } = await renderVersionLink(version);

        // THEN
        await getOdsButtonByLabel({
          container,
          label: version.id.toString(),
          isLink: true,
          disabled: isLinkDisabled,
        });
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

    it('should display a badge when version is the current version', async () => {
      // GIVEN

      // WHEN
      await renderVersionLink(currentVersionMocked);

      // THEN
      const badge = screen.getByTestId(
        VERSION_LIST_CELL_TEST_IDS.currentVersionBadge,
      );
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute(
        'label',
        labels.secretManager.current_version,
      );
      expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
    });

    it('should not display a badge when version is not the current version', async () => {
      // GIVEN

      // WHEN
      await renderVersionLink(versionDeactivatedMock);

      // THEN
      const badge = screen.queryByTestId(
        VERSION_LIST_CELL_TEST_IDS.currentVersionBadge,
      );
      expect(badge).toBeNull();
    });
  });
});
