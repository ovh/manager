import React from 'react';
import { i18n } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it } from 'vitest';
import { toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { SecretVersion } from '@secret-manager/types/secret.type';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { getOdsButtonByLabel } from '@/utils/tests/uiTestHelpers';
import { removeHandlersDelay, renderWithClient } from '@/utils/tests/testUtils';
import { initTestI18n } from '@/utils/tests/init.i18n';
import { VersionCellID } from './VersionCells.component';
import { getIamMocks } from '@/mocks/iam/iam.handler';

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
      <VersionCellID version={versionMock} urn={mockSecret1.iam.urn} />
    </I18nextProvider>,
  );

  return { container };
};

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);
vi.mocked(useParams).mockReturnValue({
  domainId: mockOkmsId,
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

  describe('Rendering', () => {
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
});
