import { screen, act, waitFor, fireEvent } from '@testing-library/react';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { SecretVersion } from '@secret-manager/types/secret.type';
import {
  assertTextVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import {
  versionActiveMock,
  versionDeactivatedMock,
  versionDeletedMock,
  versionListMock,
} from '@secret-manager/mocks/versions/versions.mock';
import { secretListMock } from '@secret-manager/mocks/secrets/secrets.mock';
import userEvent from '@testing-library/user-event';
import { SECRET_RAW_VALUE_TEST_ID } from './SecretRawValue.contants';
import {
  VERSION_SELECTOR_ERROR_TEST_ID,
  VERSION_SELECTOR_SPINNER_TEST_ID,
  VERSION_SELECTOR_TEST_ID,
} from './VersionSelector.constants';
import { SECRET_VALUE_DRAWER_TEST_ID } from './SecretValueDrawer.constants';
import {
  renderTestApp,
  RenderTestMockParams,
} from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

const mockOkmsId = '12345';
const mockSecret = secretListMock[0];
const mockSecretPath = mockSecret.path;

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretSecretValueDrawer(
  mockOkmsId,
  mockSecretPath,
);

const renderPage = async ({
  url = mockPageUrl,
  mockParams,
}: {
  url?: string;
  mockParams?: RenderTestMockParams;
}) => {
  const user = userEvent.setup();
  const { container } = await renderTestApp(url, mockParams);

  // Check if the drawer is open
  expect(
    await screen.findByTestId(
      SECRET_VALUE_DRAWER_TEST_ID,
      {},
      WAIT_FOR_DEFAULT_OPTIONS,
    ),
  ).toBeInTheDocument();

  // wait for the content to be displayed
  await assertTextVisibility(labels.secretManager.values);

  return { user, container };
};

describe('ValueDrawer test suite', () => {
  it('should display a spinner while loading secret versions', async () => {
    // GIVEN
    // WHEN
    await renderPage({});

    // THEN
    const valueSpinner = screen.getByTestId(VERSION_SELECTOR_SPINNER_TEST_ID);
    expect(valueSpinner).toBeVisible();
  });

  it('should display a notification on error loading secret versions', async () => {
    // GIVEN isVersionsKO
    // WHEN
    await renderPage({ mockParams: { isVersionsKO: true } });

    // THEN
    await waitFor(() => {
      const versionsError = screen.getByTestId(VERSION_SELECTOR_ERROR_TEST_ID);
      expect(versionsError).toBeVisible();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  describe('on versions successfully loaded', () => {
    it('should display the version selector with the last version pre-selected', async () => {
      // GIVEN
      // WHEN
      await renderPage({});

      // THEN
      await waitFor(() => {
        const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
        expect(versionSelect).toBeVisible();
        expect(versionSelect).toHaveAttribute(
          'default-value',
          versionListMock[0].id.toString(),
        );
        expect(versionSelect).toBeEnabled();
      }, WAIT_FOR_DEFAULT_OPTIONS);
    });

    it('should display the version selector with the url version pre-selected', async () => {
      // GIVEN
      const lastVersion = versionListMock.length;

      // WHEN
      await renderPage({
        url: SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
          mockOkmsId,
          mockSecretPath,
          lastVersion,
        ),
      });

      // THEN
      await waitFor(() => {
        const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
        expect(versionSelect).toBeVisible();
        expect(versionSelect).toHaveAttribute(
          'default-value',
          versionListMock[lastVersion - 1].id.toString(),
        );
        expect(versionSelect).toBeEnabled();
      }, WAIT_FOR_DEFAULT_OPTIONS);
    });

    it('should disabled the version selector when there is only one version', async () => {
      // GIVEN
      const nbVersions = 1;

      // WHEN
      await renderPage({ mockParams: { nbVersions } });

      // THEN
      await waitFor(() => {
        const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);
        expect(versionSelect).toBeVisible();
        expect(versionSelect).toBeDisabled();
      }, WAIT_FOR_DEFAULT_OPTIONS);
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
        // GIVEN version, haveValue
        await renderPage({});

        await waitFor(() => {
          expect(screen.getByTestId(VERSION_SELECTOR_TEST_ID)).toBeVisible();
        }, WAIT_FOR_DEFAULT_OPTIONS);

        // WHEN
        const versionSelect = screen.getByTestId(VERSION_SELECTOR_TEST_ID);

        await act(() => {
          fireEvent.change(versionSelect, {
            target: { value: version.id.toString() },
          });
        });

        // THEN
        await assertTextVisibility(labels.common.status.status);
        const versionStatusBadge = screen.getByTestId(VERSION_BADGE_TEST_ID);
        expect(versionStatusBadge).toBeVisible();

        if (!haveValue) return;

        // TODO: update this part when we'll handle key/value representation.
        await waitFor(() => {
          const versionRawValue = screen.getByTestId(SECRET_RAW_VALUE_TEST_ID);
          expect(versionRawValue).toBeVisible();
        }, WAIT_FOR_DEFAULT_OPTIONS);
      },
    );
  });
});
