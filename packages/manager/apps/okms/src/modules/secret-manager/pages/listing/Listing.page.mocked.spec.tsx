import { act, waitFor } from '@testing-library/react';
import { afterAll, vi } from 'vitest';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import { labels } from '@/utils/tests/init.i18n';
import { renderTestApp } from '@/utils/tests/renderTestApp';

const mockOkmsId = '12345';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('Secrets listing test suite with mocked react-router-dom', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should navigate to create a secret page with a domainId search param', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(
      SECRET_MANAGER_ROUTES_URLS.secretListing(mockOkmsId),
    );

    const createSecretButton = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.create_a_secret,
    });

    await act(() => user.click(createSecretButton));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledTimes(1);

      expect(navigateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: SECRET_MANAGER_ROUTES_URLS.secretCreate,
          search: `?${SECRET_MANAGER_SEARCH_PARAMS.domainId}=${mockOkmsId}`,
        }),
      );
    });
  });
});
