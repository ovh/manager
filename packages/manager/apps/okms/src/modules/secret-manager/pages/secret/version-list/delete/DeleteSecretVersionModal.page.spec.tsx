import * as router from 'react-router-dom';

import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { updateVersionErrorMessage } from '@secret-manager/mocks/versions/versions.handler';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderTestApp } from '@/common/utils/tests/renderTestApp';
import { assertModalVisibility } from '@/common/utils/tests/uiTestHelpers';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.versionListDeleteVersionModal(
  'okmsId',
  mockSecret1.path,
  1,
);

describe('Secret version delete modal test suite', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('should display the delete modal', async () => {
    await renderTestApp(mockPageUrl);

    await assertModalVisibility({ role: 'alertdialog' });

    const title = labels.secretManager.delete_version_modal_title.replace('{{versionId}}', '1');
    await assertTextVisibility(title);
  });

  it('should navigate back after successful deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl);

    await assertModalVisibility({ role: 'alertdialog' });

    const submitButton = await screen.findByRole('button', {
      name: labels.common.actions.delete,
    });

    await user.click(submitButton);

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    await renderTestApp(mockPageUrl, {
      isVersionUpdateKO: true,
    });

    await assertModalVisibility({ role: 'alertdialog' });

    const submitButton = await screen.findByRole('button', {
      name: labels.common.actions.delete,
    });

    await user.click(submitButton);

    await assertTextVisibility(updateVersionErrorMessage);

    // Check blocked navigation
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
  });
});
