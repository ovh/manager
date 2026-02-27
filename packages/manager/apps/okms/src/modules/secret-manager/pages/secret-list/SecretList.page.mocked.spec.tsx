import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertTitleVisibility } from '@/common/utils/tests/uiTestHelpers';
import { TIMEOUT } from '@/common/utils/tests/uiTestHelpers';

const mockOkmsId = '12345';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const module = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...module,
    useNavigate: () => navigateMock,
  };
});

describe('Secret list page test suite with mocked react-router-dom', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('should navigate to create a secret page with a okmsId search param', async () => {
    const user = userEvent.setup();
    await renderTestApp(SECRET_MANAGER_ROUTES_URLS.secretList(mockOkmsId));

    // Wait for lazy-loaded page + MSW-backed useSecretList to complete
    await assertTitleVisibility({
      title: labels.secretManager.secret_manager,
      level: 1,
      timeout: TIMEOUT.LONG,
    });

    const createSecretButton = screen.getByRole('button', {
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
