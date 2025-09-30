import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useMutation } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AntiFraudError, PCI_PROJECT_ORDER_CART } from '@/constants';
import {
  checkoutCart,
  getCartCheckout,
  attachConfigurationToCartItem as postAttachConfigurationToCartItem,
} from '@/data/api/cart';
import { payWithRegisteredPaymentMean } from '@/data/api/payment';
import { addCartCreditOption } from '@/data/api/payment/cart';
import { useGetCreditAddonOption } from '@/data/hooks/payment/useCart';
import {
  Cart,
  CartSummary,
  OrderedProduct,
  PaymentMean,
} from '@/data/types/cart.type';
import { CREDIT_ORDER_CART } from '@/payment/constants';
import useAntiFraud from './useAntiFraud';

export type UseProjectCreationProps = {
  t: TFunction;
  cart?: Cart;
  projectItem?: OrderedProduct;
  goToCreditConfirmation: () => void;
};

export const useProjectCreation = ({
  t,
  cart,
  projectItem,
  goToCreditConfirmation,
}: Readonly<UseProjectCreationProps>) => {
  const [needToCheckCustomerInfo, setNeedToCheckCustomerInfo] = useState(false);
  const [billingHref, setBillingHref] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const voucherCode = searchParams.get('voucher');

  const navigate = useNavigate();
  const { addError, addWarning } = useNotifications();
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const { checkAntiFraud } = useAntiFraud();
  const { data: creditAddonOption } = useGetCreditAddonOption(cart?.cartId);

  const handleError = (error: unknown) => {
    const antiFraudError = error as AntiFraudError;
    if (antiFraudError === AntiFraudError.CASE_FRAUD_REFUSED) {
      addError(
        t('pci_project_new_payment_check_anti_fraud_case_fraud_refused', {
          ns: 'new/payment',
        }),
      );
    } else if (antiFraudError === AntiFraudError.NEED_CUSTOMER_INFO_CHECK) {
      setNeedToCheckCustomerInfo(true);
      if (orderId) {
        navigation
          .getURL('dedicated', '#/billing/orders/:orderId', {
            orderId,
          })
          .then((url) => setBillingHref(String(url)));
      }
      addWarning(
        t('pci_project_new_payment_create_error_fraud_suspect', {
          ns: 'new/payment',
        }),
      );
    } else {
      addError(
        t('pci_project_new_payment_checkout_error', {
          ns: 'new/payment',
        }),
      );
    }
  };

  // Infrastructure configuration mutation
  const infraConfigMutation = useMutation({
    mutationFn: async () => {
      /**
       * TODO: should be trigger while some conditions are met
       */
      return postAttachConfigurationToCartItem(
        cart!.cartId,
        projectItem!.itemId,
        {
          label: 'infrastructure',
          value: PCI_PROJECT_ORDER_CART.infraConfigValue,
        },
      );
    },
    onError: handleError,
  });

  // Credit configuration mutation (separate for better control)
  const creditConfigMutation = useMutation({
    mutationFn: async ({ creditAmount }: { creditAmount: number }) => {
      if (!creditAddonOption?.prices?.length) {
        return null;
      }

      return addCartCreditOption(cart!.cartId, {
        planCode: CREDIT_ORDER_CART.planCode,
        quantity: Math.floor(
          creditAmount / creditAddonOption.prices[0].price.value,
        ),
        duration: creditAddonOption.prices[0].duration,
        pricingMode: creditAddonOption.prices[0].pricingMode,
        itemId: projectItem!.itemId,
      });
    },
    onError: handleError,
  });

  // Check if payment is required
  const checkPaymentRequiredMutation = useMutation({
    mutationFn: async () => {
      const cartSummary = await getCartCheckout(cart!.cartId);
      return {
        paymentRequired: cartSummary.prices.withTax.value !== 0,
        cartSummary,
      };
    },
    onSuccess: ({ paymentRequired }) => {
      if (paymentRequired) {
        goToCreditConfirmation();
      }
    },
    onError: handleError,
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return checkoutCart(cart!.cartId);
    },
    onSuccess: async (cartSummary) => {
      // Auto-pay with fidelity account if free
      if (cartSummary.prices.withTax.value === 0 && cartSummary.orderId) {
        await payWithRegisteredPaymentMean(cartSummary.orderId, {
          paymentMean: PaymentMean.FIDELITY_ACCOUNT,
        });
      }
    },
    onError: handleError,
  });

  const antiFraudCheckMutation = useMutation({
    mutationFn: async (cartSummary: CartSummary) => {
      if (!cartSummary?.orderId) {
        throw new Error('Order ID missing');
      }

      setOrderId(cartSummary.orderId);

      await checkAntiFraud(cartSummary);

      return cartSummary;
    },
    onSuccess: (cartSummary) => {
      if (cartSummary.orderId) {
        // Navigate to Creating page
        const redirectPath = voucherCode
          ? `../creating/${cartSummary.orderId}/${voucherCode}`
          : `../creating/${cartSummary.orderId}`;
        navigate(redirectPath);
      }
    },
    onError: handleError,
  });

  const handleProjectCreation = async ({
    isCreditPayment = false,
    creditAmount = 0,
  }: {
    isCreditPayment?: boolean;
    creditAmount?: number;
  }) => {
    // Step 1: Setup infrastructure config
    await infraConfigMutation.mutateAsync();

    // Step 2: Setup credit config if needed
    if (isCreditPayment) {
      await creditConfigMutation.mutateAsync({ creditAmount });
    }

    // Step 3: Check if payment required
    const {
      paymentRequired,
    } = await checkPaymentRequiredMutation.mutateAsync();

    if (!paymentRequired) {
      // Step 4: If no payment required, proceed with checkout
      const cartSummary = await checkoutMutation.mutateAsync();

      // Step 5: Run anti-fraud check
      await antiFraudCheckMutation.mutateAsync(cartSummary);
    }
  };

  const handleCreditAndPay = async () => {
    const cartSummary = await checkoutMutation.mutateAsync();

    if (cartSummary.url && window.top) {
      window.top.location.href = cartSummary.url;
    }
  };

  const isSubmitting = [
    infraConfigMutation,
    creditConfigMutation,
    checkPaymentRequiredMutation,
    checkoutMutation,
    antiFraudCheckMutation,
  ].some((mutation) => mutation.isPending);

  return {
    handleProjectCreation,
    handleCreditAndPay,
    isSubmitting,
    needToCheckCustomerInfo,
    billingHref,
  };
};
