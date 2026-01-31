import * as router from 'react-router-dom';

import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { deleteSecretErrorMessage } from '@secret-manager/mocks/secrets/secrets.handler';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import {
  assertOdsModalVisibility,
  assertTextVisibility,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';

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
    const { container } = await renderTestApp(mockPageUrl);

    await assertOdsModalVisibility({ container, isVisible: true });

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
    const { container } = await renderTestApp(mockPageUrl);

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.delete,
      disabled: false,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for loading states to complete
    await waitFor(
      () => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(mockSecretListingPage);
    });
  });

  it('should show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl, {
      isDeleteSecretKO: true,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.delete,
      disabled: false,
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await assertTextVisibility(deleteSecretErrorMessage);

    // Check blocked navigation
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });
});
