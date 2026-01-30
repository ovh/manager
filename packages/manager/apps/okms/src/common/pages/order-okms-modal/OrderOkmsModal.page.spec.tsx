import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { AxiosResponse } from 'axios';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import { OdsCheckbox } from '@ovhcloud/ods-components';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import {
  Contract,
  Order,
  createCart,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';
import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { useProductType } from '@/common/hooks/useProductType';
import { registerPendingOrder } from '@/common/store/pendingOkmsOrder';
import { initTestI18n, labels } from '@/common/utils/tests/init.i18n';
import {
  createErrorResponseMock,
  promiseWithDelayMock,
  renderWithClient,
  wait,
} from '@/common/utils/tests/testUtils';

import OrderOkmsModal from './OrderOkmsModal.page';
import {
  ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID,
  ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID,
  ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
} from './OrderOkmsModal.page.constants';

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

vi.mock('@/common/hooks/useProductType', () => ({
  useProductType: vi.fn(),
}));

vi.mock('@/common/store/pendingOkmsOrder', () => ({
  registerPendingOrder: vi.fn(),
}));

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

// Declare mocked functions with proper types
const mockedCreateCart = vi.mocked(createCart);
const mockedPostOrderCartCartIdCheckout = vi.mocked(postOrderCartCartIdCheckout);
const mockedRegisterPendingOrder = vi.mocked(registerPendingOrder);
const mockedUseProductType = vi.mocked(useProductType);

const renderOrderOkmsModal = async () => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return renderWithClient(
    <I18nextProvider i18n={i18nValue}>
      <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
        <OrderOkmsModal />
      </ShellContext.Provider>
    </I18nextProvider>,
  );
};

const clickOnConfirmCheckbox = () => {
  const confirmCheckbox = screen.getByTestId(
    ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
  ) as unknown as OdsCheckbox;
  act(() => {
    confirmCheckbox.odsChange.emit({
      name: 'confirm-contract',
      value: 'confirm-contract',
      checked: true,
    });
  });
};

const clickOnConfirmButton = async (user: UserEvent) => {
  // Small wait to ensure state updates
  // Fails intermittently without this - button click does not always works
  await wait(300);

  let confirmButton: HTMLElement | undefined = undefined;
  await waitFor(() => {
    confirmButton = screen.getByTestId(ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID);
    expect(confirmButton).not.toBeDisabled();
  });
  await act(() => user.click(confirmButton!));

  return confirmButton;
};

const submitOrder = async (user: UserEvent) => {
  await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_title);

  clickOnConfirmCheckbox();
  await clickOnConfirmButton(user);
};

describe('Order Okms Modal test suite', () => {
  beforeEach(() => {
    // Reset all mocks before each test to ensure clean state
    vi.clearAllMocks();

    // Set default implementations that work for most tests
    mockedCreateCart.mockResolvedValue({
      cartId: 'cart-id',
      contractList: mockedContracts,
    });

    mockedPostOrderCartCartIdCheckout.mockResolvedValue({} as AxiosResponse<Order>);

    mockedUseProductType.mockReturnValue('secret-manager');
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  describe('on init', () => {
    it('should display a loading state when creating a cart', async () => {
      // GIVEN - Override the default mock with a delayed one to ensure loading state is visible
      mockedCreateCart.mockImplementationOnce(() =>
        promiseWithDelayMock({ cartId: 'cart-id', contractList: mockedContracts }, 1000),
      );

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await waitFor(
        () => {
          expect(screen.getByTestId(ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID)).toBeVisible();
        },
        { timeout: 5000, interval: 200 },
      );
    });

    it('should display terms and conditions on cart successful creation', async () => {
      // GIVEN - Use default mock (no need to override)

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_title);
    });

    it('should display a notification and a retry button on error', async () => {
      // GIVEN
      const mockError = new Error('Failed to create cart');
      mockedCreateCart.mockRejectedValueOnce(mockError);

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(
        labels.common.error.error_message.replace('{{message}}', mockError.message),
      );
      expect(screen.getByTestId(ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID)).toBeVisible();
      expect(screen.getByTestId(ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID)).toBeVisible();
    });
  });

  describe('on terms and conditions', () => {
    it('should display terms and conditions', async () => {
      // GIVEN - Use default mock

      // WHEN
      await renderOrderOkmsModal();

      // THEN
      await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_title);
      await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_description);

      for (const contract of mockedContracts) {
        expect(await screen.findByText(contract.name)).toBeInTheDocument();
      }

      const confirmCheckbox = screen.getByTestId(ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID);
      expect(confirmCheckbox).toBeVisible();
      expect(confirmCheckbox).toHaveAttribute('is-checked', 'false');

      expect(screen.getByTestId(ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID)).toBeVisible();

      const confirmButton = screen.getByTestId(ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID);
      expect(confirmButton).toBeVisible();
      expect(confirmButton).toBeDisabled();
    });

    it('should enable confirm button on condition approval', async () => {
      // GIVEN
      await renderOrderOkmsModal();
      await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_title);

      // WHEN
      clickOnConfirmCheckbox();

      // THEN
      const confirmButton = screen.getByTestId(ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID);
      expect(confirmButton).not.toBeDisabled();
    });

    it('should show a loading button on confirmation', async () => {
      const user = userEvent.setup();

      // GIVEN - Override checkout mock with delay to ensure loading state is visible
      mockedPostOrderCartCartIdCheckout.mockImplementationOnce(() =>
        promiseWithDelayMock({} as AxiosResponse<Order>, 2000),
      );

      await renderOrderOkmsModal();
      await assertTextVisibility(labels.secretManager.create_okms_terms_and_conditions_title);

      // WHEN

      // THEN - Test loading state
      clickOnConfirmCheckbox();
      const confirmButton = await clickOnConfirmButton(user);
      // THEN - Test loading state
      await waitFor(() => {
        expect(confirmButton).toHaveAttribute('data-loading', 'true');
      });
    });

    it('should register the pending order on success', async () => {
      const user = userEvent.setup();

      // GIVEN
      await renderOrderOkmsModal();

      // // WHEN
      await submitOrder(user);

      // THEN
      await waitFor(() => {
        expect(mockedRegisterPendingOrder).toHaveBeenCalledWith(mockedRegion);
      });
    });

    it('should close the modal on success for secret manager', async () => {
      mockedUseProductType.mockReturnValue('secret-manager');

      const user = userEvent.setup();

      // GIVEN - Use fast default mock
      await renderOrderOkmsModal();

      // WHEN
      await submitOrder(user);

      // THEN
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('..');
      });
    });

    it('should navigate to the kms listing page on success for key management service', async () => {
      mockedUseProductType.mockReturnValue('key-management-service');

      const user = userEvent.setup();

      // GIVEN - Use fast default mock
      await renderOrderOkmsModal();

      // WHEN
      await submitOrder(user);

      // THEN
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(KMS_ROUTES_URLS.kmsListing);
      });
    });

    it('should display a notification on error', async () => {
      const user = userEvent.setup();

      // GIVEN
      const mockError = createErrorResponseMock('Failed to submit order');
      mockedPostOrderCartCartIdCheckout.mockRejectedValueOnce(mockError);

      await renderOrderOkmsModal();

      // WHEN
      await submitOrder(user);

      // THEN
      await assertTextVisibility(
        labels.common.error.error_message.replace('{{message}}', mockError.response.data.message),
      );
    });
  });
});
