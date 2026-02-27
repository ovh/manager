import { KEY_VALUES_TEST_IDS } from '@secret-manager/components/secret-value/secretValueClipboards.constants';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
  versionListMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { labels } from '@/common/utils/tests/init.i18n';
import { RenderTestMockParams, renderTestApp } from '@/common/utils/tests/renderTestApp';
import {
  TIMEOUT,
  assertDrawerVisibility,
  assertMessageVisibility,
} from '@/common/utils/tests/uiTestHelpers';

import {
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SELECT_SKELETON_TEST_ID,
  VERSION_SELECTOR_STATUS_SKELETON_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from './VersionSelector.constants';

const mockOkmsId = '12345';
const mockSecret = secretListMock[0];
const mockSecretPath = mockSecret?.path ?? '';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretSecretValueDrawer(mockOkmsId, mockSecretPath);

const renderPage = async ({
  url = mockPageUrl,
  mockParams,
  waitForContent = true,
}: {
  url?: string;
  mockParams?: RenderTestMockParams;
  waitForContent?: boolean;
} = {}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(url, mockParams);

  // Check if the drawer is open (use MEDIUM timeout for lazy-loaded route)
  await assertDrawerVisibility({ state: 'visible', timeout: TIMEOUT.MEDIUM });

  if (waitForContent) {
    // wait for the content to be displayed
    await screen.findByText(labels.secretManager.values);
  }

  return { user, container };
};

describe('ValueDrawer test suite', () => {
  it('should display skeletons while loading secret versions', async () => {
    // GIVEN versions API delayed so loading state is visible
    // WHEN
    await renderPage({
      waitForContent: false,
      mockParams: { delay: 500 },
    });

    // THEN skeletons are shown while versions are loading
    const selectSkeleton = await screen.findByTestId(
      VERSION_SELECTOR_SELECT_SKELETON_TEST_ID,
      {},
      { timeout: TIMEOUT.MEDIUM },
    );
    const statusSkeleton = await screen.findByTestId(
      VERSION_SELECTOR_STATUS_SKELETON_TEST_ID,
      {},
      { timeout: TIMEOUT.MEDIUM },
    );
    expect(selectSkeleton).toBeVisible();
    expect(statusSkeleton).toBeVisible();
  });

  it('should display a notification on error loading secret versions', async () => {
    // GIVEN isVersionsKO
    // WHEN
    await renderPage({ mockParams: { isVersionsKO: true } });

    // THEN
    await waitFor(
      () => {
        const versionsError = screen.getByTestId(VERSION_SELECTOR_ERROR_TEST_ID);
        expect(versionsError).toBeVisible();
      },
      { timeout: TIMEOUT.MEDIUM },
    );
  });

  describe('on versions successfully loaded', () => {
    it('should display the version selector with the last version pre-selected', async () => {
      // GIVEN
      // WHEN
      await renderPage();

      const selectedVersionId = versionListMock[0]?.id;
      if (!selectedVersionId) {
        throw new Error('No version id found');
      }

      // THEN
      await waitFor(
        () => {
          const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
          expect(versionSelect).toBeVisible();
          // For ODS19 Select, find the combobox within the Select component
          const combobox = within(versionSelect).getByRole('combobox');
          expect(combobox).toHaveTextContent(selectedVersionId.toString());
          expect(combobox).toBeEnabled();
        },
        { timeout: TIMEOUT.MEDIUM },
      );
    });

    it('should display the version selector with the url version pre-selected', async () => {
      // GIVEN
      const lastVersionId = versionListMock.length;

      // WHEN
      await renderPage({
        url: SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
          mockOkmsId,
          mockSecretPath,
          lastVersionId,
        ),
      });

      const selectedVersionId = versionListMock[lastVersionId - 1]?.id;
      if (!selectedVersionId) {
        throw new Error('No version id found');
      }

      // THEN
      await waitFor(
        () => {
          const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
          expect(versionSelect).toBeVisible();
          // Find the combobox within the Select component
          const combobox = within(versionSelect).getByRole('combobox');
          expect(combobox).toHaveTextContent(selectedVersionId.toString());
          expect(combobox).toBeEnabled();
        },
        { timeout: TIMEOUT.MEDIUM },
      );
    });

    it('should disabled the version selector when there is only one version', async () => {
      // GIVEN
      const nbVersions = 1;

      // WHEN
      await renderPage({ mockParams: { nbVersions } });

      // THEN
      await waitFor(
        () => {
          const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
          expect(versionSelect).toBeVisible();
          // Find the combobox within the Select component
          const combobox = within(versionSelect).getByRole('combobox');
          expect(combobox).toBeVisible();
          expect(combobox).toBeDisabled();
        },
        { timeout: TIMEOUT.MEDIUM },
      );
    });

    it('should display a message when the selected version is the current version', async () => {
      // GIVEN
      const currentVersionId = mockSecret?.version?.id ?? 0;

      // WHEN
      await renderPage({
        url: SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
          mockOkmsId,
          mockSecretPath,
          currentVersionId,
        ),
      });

      // THEN
      await assertMessageVisibility(labels.secretManager.current_version);
    });
  });

  describe('on version selection', () => {
    type TestCases = {
      version: SecretVersion;
      haveValue: boolean;
    };
    const testCases: TestCases[] = [
      {
        version: versionActiveMock,
        haveValue: true,
      },
      {
        version: versionDeactivatedMock,
        haveValue: false,
      },
      {
        version: versionDeletedMock,
        haveValue: false,
      },
    ];

    it.each(testCases)(
      'should display the correct version informations for $version',
      async ({ version, haveValue }) => {
        const user = userEvent.setup();

        // GIVEN version, haveValue
        await renderPage();

        // Wait for the version select to be ready
        const versionSelect = await screen.findByTestId(VERSION_SELECTOR_TEST_ID);

        // For ODS19 Select, find the combobox within the Select component
        const combobox = within(versionSelect).getByRole('combobox');
        await act(async () => user.click(combobox));

        // Wait for the select to be expanded and options to appear
        await waitFor(
          () => {
            expect(combobox).toHaveAttribute('aria-expanded', 'true');
          },
          { timeout: TIMEOUT.MEDIUM },
        );

        // Wait for the option to appear and click it
        const option = await screen.findByRole('option', { name: version.id.toString() });
        await act(async () => user.click(option));

        // THEN - Wait for state updates to complete after selection
        await waitFor(
          () => {
            expect(screen.getByText(labels.common.status.status)).toBeVisible();
          },
          { timeout: TIMEOUT.MEDIUM },
        );
        await waitFor(() => {
          const versionStatusBadge = screen.getByTestId(VERSION_BADGE_TEST_ID);
          expect(versionStatusBadge).toBeVisible();
        });

        if (!haveValue) return;

        await waitFor(
          () => {
            const keyValuesContainer = screen.getByTestId(KEY_VALUES_TEST_IDS.container);
            expect(keyValuesContainer).toBeVisible();
          },
          { timeout: TIMEOUT.MEDIUM },
        );
      },
    );
  });
});
