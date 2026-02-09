import * as router from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { deleteSecretErrorMessage } from '@secret-manager/mocks/secrets/secrets.handler';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertModalVisibility, assertTextVisibility } from '@/common/utils/tests/uiTestHelpers';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretDeleteSecret(
  okmsRoubaix1Mock.id,
  mockSecret1.path,
);

const mockSecretListingPage = SECRET_MANAGER_ROUTES_URLS.secretList(okmsRoubaix1Mock.id);

describe('Delete secret modal test suite', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('should display the delete modal', async () => {
    await renderTestApp(mockPageUrl);

    await assertModalVisibility();

    const title = labels.secretManager.delete_secret_modal_title;

    await assertTextVisibility(title);
    const description = labels.secretManager.delete_secret_modal_description.replace(
      '{{secretPath}}',
      mockSecret1.path,
    );
    await assertTextVisibility(description);
  });

  it('should navigate back after successful deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await assertModalVisibility();

    const submitButton = await screen.findByRole('button', {
      name: labels.common.actions.delete,
    });

    await act(() => user.click(submitButton));

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(mockSecretListingPage);
    });
  });

  it('should show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl, {
      isDeleteSecretKO: true,
    });

    await assertModalVisibility();

    const submitButton = await screen.findByRole('button', {
      name: labels.common.actions.delete,
    });

    await act(() => user.click(submitButton));

    await assertTextVisibility(deleteSecretErrorMessage);

    // Check blocked navigation
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });
});
