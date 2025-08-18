import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act, screen, waitFor } from '@testing-library/react';
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

vi.mock('@ovh-ux/manager-module-vcd-api', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-module-vcd-api');
  return {
    ...actual,
    useActivateVmwareCloudDirectorBackupOfferGold: vi.fn(),
  };
});

describe('Activate offer modal', () => {
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
    },
    {
      name: 'cancel',
      mockHook: () => ({
        activateGoldOffer: vi.fn(),
        isPending: false,
      }),
      clickTestId: TEST_IDS.cancelOfferModalAction,
      expectedText: null,
    },
  ])(
    'should handle $name flow correctly',
    async ({ mockHook, clickTestId, expectedText }) => {
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
    },
  );
});
