import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { act } from '@testing-library/react';
import {
  assertOdsModalVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constant';

const trackClickMock = vi.fn();
const trackPageMock = vi.fn();
const trackCurrentPageMock = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...actual,
    useOvhTracking: () => ({
      trackCurrentPage: trackCurrentPageMock,
      trackPage: trackPageMock,
      trackClick: trackClickMock,
    }),
  };
});

describe('Delete veeam-backup modal opening', () => {
  it('Delete a backup', async () => {
    const user = userEvent.setup();
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    const deleteButton = await getElementByTestId(TEST_IDS.deleteServiceCta);
    expect(deleteButton).toBeEnabled();

    await act(() => user.click(deleteButton));

    await assertOdsModalVisibility({ container, isVisible: true });
  });
});

describe('confirm Delete veeam-backup modal', () => {
  it('Delete a backup', async () => {
    const user = userEvent.setup();
    await renderTest({
      initialRoute: urls.deleteVeeamFromDashboard.replace(
        ':id',
        backupList[1].id,
      ),
    });

    const deleteButton = await getElementByTestId(
      TEST_IDS.confirmDeleteServiceModal,
    );

    await act(() => user.click(deleteButton));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.deleteVeeam.clicks.confirmDelete,
    );
  });
});

describe('cancel Delete veeam-backup modal', () => {
  it('Delete a backup', async () => {
    const user = userEvent.setup();
    await renderTest({
      initialRoute: urls.deleteVeeamFromDashboard.replace(
        ':id',
        backupList[1].id,
      ),
    });

    const deleteButton = await getElementByTestId(
      TEST_IDS.cancelDeleteServiceModal,
    );

    await act(() => user.click(deleteButton));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.deleteVeeam.clicks.closeModal,
    );
  });
});
