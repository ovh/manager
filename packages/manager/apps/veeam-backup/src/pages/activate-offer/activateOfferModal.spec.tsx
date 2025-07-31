import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act, screen, waitFor } from '@testing-library/react';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import {
  assertOdsModalVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import {
  useActivateVmwareCloudDirectorBackupOfferGold,
  backupList,
} from '@ovh-ux/manager-module-vcd-api';

import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING, PageName } from '@/tracking.constant';

vi.mock('@ovh-ux/manager-module-vcd-api', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-module-vcd-api');
  return {
    ...actual,
    useActivateVmwareCloudDirectorBackupOfferGold: vi.fn(),
  };
});

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

describe('Activate offer modal', () => {
  beforeEach(() => {
    trackClickMock.mockClear();
    trackPageMock.mockClear();
    trackCurrentPageMock.mockClear();
  });
  it.each([
    {
      name: 'success',
      mockHook: ({ onSuccess }: any) => ({
        activateGoldOffer: vi.fn().mockImplementation(() => {
          onSuccess?.();
          return Promise.resolve({});
        }),
        isPending: false,
      }),
      clickTestId: TEST_IDS.activateOfferModalAction,
      expectedText: 'success',
      expectedTrackingCalls: {
        trackClick: TRACKING.activateVeeamBackupOffer.clicks.confirmActivation,
        trackPage: {
          pageType: PageType.bannerSuccess,
          pageName: PageName.successActivateOfferGold,
        },
      },
    },
    {
      name: 'error',
      mockHook: ({ onError }: any) => ({
        activateGoldOffer: vi.fn().mockImplementation(() => {
          const error = {
            response: { data: { message: 'activation_failed' } },
          };
          onError?.(error as any);
          return Promise.reject(error);
        }),
        isPending: false,
      }),
      clickTestId: TEST_IDS.activateOfferModalAction,
      expectedText: 'error',
      expectedTrackingCalls: {
        trackClick: TRACKING.activateVeeamBackupOffer.clicks.confirmActivation,
        trackPage: {
          pageType: PageType.bannerError,
          pageName: PageName.errorActivateOfferGold,
        },
      },
    },
    {
      name: 'cancel',
      mockHook: () => ({
        activateGoldOffer: vi.fn(),
        isPending: false,
      }),
      clickTestId: TEST_IDS.cancelOfferModalAction,
      expectedText: null,
      expectedTrackingCalls: {
        trackClick: TRACKING.activateVeeamBackupOffer.clicks.closeModal,
        trackPage: null,
      },
    },
  ])(
    'should handle $name flow correctly',
    async ({ mockHook, clickTestId, expectedText, expectedTrackingCalls }) => {
      const user = userEvent.setup();

      (useActivateVmwareCloudDirectorBackupOfferGold as ReturnType<
        typeof vi.fn
      >).mockImplementation(mockHook);

      const { container } = await renderTest({
        initialRoute: urls.dashboard.replace(':id', backupList[1].id),
      });

      await assertTextVisibility(labels.dashboard.display_name);

      const openModalBtn = await getElementByTestId(
        TEST_IDS.activateGoldOfferAction,
      );

      await act(() => user.click(openModalBtn));
      await assertOdsModalVisibility({ container, isVisible: true });

      const btn = await screen.findByTestId(clickTestId);
      await act(() => user.click(btn));

      await assertOdsModalVisibility({ container, isVisible: false });

      if (expectedText) {
        await waitFor(() => {
          expect(screen.getByText(expectedText)).toBeInTheDocument();
        });
      }

      if (expectedTrackingCalls?.trackClick) {
        expect(trackClickMock).toHaveBeenCalledWith(
          expectedTrackingCalls.trackClick,
        );
      } else {
        expect(trackClickMock).not.toHaveBeenCalled();
      }
      if (expectedTrackingCalls?.trackPage) {
        expect(trackPageMock).toHaveBeenCalledWith(
          expectedTrackingCalls.trackPage,
        );
      } else {
        expect(trackPageMock).not.toHaveBeenCalled();
      }
    },
  );
});
