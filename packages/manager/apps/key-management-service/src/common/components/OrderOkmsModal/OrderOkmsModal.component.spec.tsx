import React from 'react';
import { i18n } from 'i18next';
import { AxiosResponse } from 'axios';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  Contract,
  createCart,
  Order,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import {
  OkmsRegionOrderSuccessful,
  OrderOkmsModal,
} from './OrderOkmsModal.component';
import {
  ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID,
  ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID,
  ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
} from './OrderOkmsModal.component.constants';

let i18nValue: i18n;

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
};

const mockedRegion = 'mocked-region';

const mockedContracts: Contract[] = [
  {
    content: 'contract-1-content',
    name: 'contract-1',
    url: 'contrat-1-url',
  },
  {
    content: 'contract-2-content',
    name: 'contract-2',
    url: 'contrat-2-url',
  },
];

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => navigate,
    useParams: () => ({ region: mockedRegion }),
  };
});

vi.mock('@ovh-ux/manager-module-order', async (importOriginal) => {
  const module: typeof import('@ovh-ux/manager-module-order') = await importOriginal();
  return {
    ...module,
    createCart: vi.fn(),
    postOrderCartCartIdCheckout: vi.fn(),
  };
});

const renderOrderOkmsModal = async () => {
  const queryClient = new QueryClient();
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <OrderOkmsModal />
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

const clickOnConfirmCheckbox = async () => {
  const confirmCheckbox = screen.getByTestId(
    ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
  await act(() => {
    confirmCheckbox.odsChange.emit({
      checked: 'true',
    });
  });
};

const clickOnConfirmButton = async (user: UserEvent) => {
  const confirmButton = screen.getByTestId(
    ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
  );
  await waitFor(() => {
    expect(confirmButton).toHaveAttribute('is-disabled', 'false');
  });
  await act(() => user.click(confirmButton));
  return confirmButton;
};

describe('Order Okms Modal test suite', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('on init', () => {
    it('should display a loading state when creating a cart', async () => {
      // GIVEN
      vi.mocked(createCart).mockImplementation(() => new Promise(() => {}));

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await waitFor(() => {
        expect(
          screen.getByTestId(ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID),
        ).toBeVisible();
      });
    });

    it('should display terms and conditions on cart succesful creation', async () => {
      // GIVEN
      vi.mocked(createCart).mockResolvedValueOnce({
        cartId: 'cart-id',
        contractList: [],
      });

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );
    });

    it('should display a notification and a retry button on error', async () => {
      // GIVEN
      const mockError = new Error('Failed to create cart');
      vi.mocked(createCart).mockRejectedValue(mockError);

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(
        labels.common.error.error_message.replace(
          '{{message}}',
          mockError.message,
        ),
      );
      expect(
        screen.getByTestId(ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID),
      ).toBeVisible();
      expect(
        screen.getByTestId(ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID),
      ).toBeVisible();
    });
  });

  describe('on terms and conditions', () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(createCart).mockResolvedValue({
        cartId: 'cart-id',
        contractList: mockedContracts,
      });
    });

    it('should display terms and conditions', async () => {
      // GIVEN
      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_description,
      );

      mockedContracts.forEach(async (contract) => {
        await assertTextVisibility(contract.name);
      });

      const confirmCheckbox = screen.getByTestId(
        ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
      );
      expect(confirmCheckbox).toBeVisible();
      expect(confirmCheckbox).toHaveAttribute('is-checked', 'false');

      expect(
        screen.getByTestId(ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID),
      ).toBeVisible();

      const confirmButton = screen.getByTestId(
        ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
      );
      expect(confirmButton).toBeVisible();
      expect(confirmButton).toHaveAttribute('is-disabled', 'true');
    });

    it('should enable confirm button on condition approval', async () => {
      // GIVEN
      await renderOrderOkmsModal();
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );

      // WHEN
      await clickOnConfirmCheckbox();

      // THEN
      const confirmButton = screen.getByTestId(
        ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
      );
      expect(confirmButton).toHaveAttribute('is-disabled', 'false');
    });

    it('should show a loading button on confirmation', async () => {
      const user = userEvent.setup();

      // GIVEN
      vi.mocked(postOrderCartCartIdCheckout).mockImplementation(
        () => new Promise(() => {}),
      );
      await renderOrderOkmsModal();
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );

      // WHEN
      await clickOnConfirmCheckbox();
      const confirmButton = await clickOnConfirmButton(user);

      // THEN
      await waitFor(() => {
        expect(confirmButton).toHaveAttribute('is-loading', 'true');
      });
    });

    it('should close the modal on success', async () => {
      const user = userEvent.setup();
      // GIVEN
      vi.mocked(postOrderCartCartIdCheckout).mockResolvedValueOnce(
        {} as AxiosResponse<Order>,
      );

      await renderOrderOkmsModal();
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );

      // WHEN
      await clickOnConfirmCheckbox();
      await clickOnConfirmButton(user);

      // THEN
      const state: OkmsRegionOrderSuccessful = {
        orderRegion: mockedRegion,
      };

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledTimes(1);
      });
      expect(navigate).toHaveBeenCalledWith('..', { state });
    });

    it('should display a notification on error', async () => {
      const user = userEvent.setup();
      // GIVEN
      const mockError = new Error('Failed to submit order');
      vi.mocked(postOrderCartCartIdCheckout).mockRejectedValueOnce(mockError);

      await renderOrderOkmsModal();
      await assertTextVisibility(
        labels.secretManager.create.create_domain_tc_title,
      );

      // WHEN
      await clickOnConfirmCheckbox();
      await clickOnConfirmButton(user);

      // THEN
      await assertTextVisibility(
        labels.common.error.error_message.replace(
          '{{message}}',
          mockError.message,
        ),
      );
    });
  });
});
