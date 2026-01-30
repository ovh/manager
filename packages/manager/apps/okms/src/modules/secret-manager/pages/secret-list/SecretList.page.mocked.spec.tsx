import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

const mockOkmsId = '12345';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('Secret list page test suite with mocked react-router-dom', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should navigate to create a secret page with a okmsId search param', async () => {
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretList(mockOkmsId));

    const createSecretButton = await screen.findByRole('button', {
      name: labels.secretManager.create_a_secret,
    });

    await act(() => user.click(createSecretButton));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledTimes(1);

      expect(navigateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: SECRET_MANAGER_ROUTES_URLS.createSecret,
          search: `?${SECRET_MANAGER_SEARCH_PARAMS.okmsId}=${mockOkmsId}`,
        }),
      );
    });
  });
});
