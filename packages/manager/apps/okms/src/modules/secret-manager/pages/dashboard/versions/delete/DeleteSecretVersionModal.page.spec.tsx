import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getOdsButtonByLabel,
  assertOdsModalVisibility,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import * as router from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { updateVersionErrorMessage } from '@secret-manager/mocks/versions/versions.handler';
import { renderTestApp } from '@/utils/tests/renderTestApp';
import { labels } from '@/utils/tests/init.i18n';

const mockPageUrl = SECRET_MANAGER_ROUTES_URLS.secretVersionsModalDeleteVersion(
  'okmsId',
  'secretPath',
  1,
);

describe('Secret version delete modal test suite', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockReset();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('should display the delete modal', async () => {
    const { container } = await renderTestApp(mockPageUrl);

    await assertOdsModalVisibility({ container, isVisible: true });

    const title = labels.secretManager.delete_version_modal_title.replace(
      '{{versionId}}',
      '1',
    );
    await assertTextVisibility(title);
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

    user.click(submitButton);

    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should show a notification after failed deletion', async () => {
    const user = userEvent.setup();
    const { container } = await renderTestApp(mockPageUrl, {
      isVersionUpdateKO: true,
    });

    await assertOdsModalVisibility({ container, isVisible: true });

    const submitButton = await getOdsButtonByLabel({
      container,
      label: labels.common.actions.delete,
      disabled: false,
    });

    user.click(submitButton);

    await assertTextVisibility(updateVersionErrorMessage);

    // Check blocked navigation
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled);
  });
});
