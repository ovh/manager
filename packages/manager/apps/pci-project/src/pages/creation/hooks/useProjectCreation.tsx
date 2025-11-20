import { useCallback, useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Translation } from 'react-i18next';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { AntiFraudError, CREDIT_ORDER_CART, PCI_PROJECT_ORDER_CART } from '@/constants';
import {
  addItemToCart,
  checkoutCart,
  getCartCheckout,
  attachConfigurationToCartItem as postAttachConfigurationToCartItem,
} from '@/data/api/cart';
import { payWithRegisteredPaymentMean } from '@/data/api/payment';
import { useGetCreditAddonOption } from '@/data/hooks/useCart';
import { Cart, CartSummary, OrderedProduct, PaymentMean } from '@/data/models/Cart.type';

import useAntiFraud from './useAntiFraud';

export type UseProjectCreationProps = {
  cart?: Cart;
  projectItem?: OrderedProduct;
  goToCreditConfirmation: () => void;
};

export const useProjectCreation = ({
  cart,
  projectItem,
  goToCreditConfirmation,
}: Readonly<UseProjectCreationProps>) => {
  const [needToCheckCustomerInfo, setNeedToCheckCustomerInfo] = useState(false);
  const [billingHref, setBillingHref] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const [voucherCode, setVoucherCode] = useState<string | null>(null);

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
        <Translation ns="payment">
          {(_t) => _t('pci_project_new_payment_check_anti_fraud_case_fraud_refused')}
        </Translation>,
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
        <Translation ns="payment">
          {(_t) => _t('pci_project_new_payment_create_error_fraud_suspect')}
        </Translation>,
      );
    } else {
      addError(
        <Translation ns="payment">
          {(_t) => _t('pci_project_new_payment_checkout_error')}
        </Translation>,
      );
    }
  };

  // Infrastructure configuration mutation
  const infraConfigMutation = useMutation({
    mutationFn: async () => {
      /**
       * TODO: should be trigger while some conditions are met
       */
      return postAttachConfigurationToCartItem(cart!.cartId, projectItem!.itemId, {
        label: 'infrastructure',
        value: PCI_PROJECT_ORDER_CART.infraConfigValue,
      });
    },
    onError: handleError,
  });

  // Credit configuration mutation (separate for better control)
  const creditConfigMutation = useMutation({
    mutationFn: async ({ creditAmount }: { creditAmount: number }) => {
      if (!creditAddonOption?.prices?.length) {
        return null;
      }

      const price = creditAddonOption.prices[0];
      if (!price) {
        return null;
      }
      return addItemToCart(cart!.cartId, {
        planCode: CREDIT_ORDER_CART.planCode,
        quantity: Math.floor(creditAmount / price.price.value),
        duration: price.duration,
        pricingMode: price.pricingMode,
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

  const infraConfigMutationFn = infraConfigMutation.mutateAsync;
  const creditConfigMutationFn = creditConfigMutation.mutateAsync;
  const checkPaymentRequiredMutationFn = checkPaymentRequiredMutation.mutateAsync;
  const checkoutMutationFn = checkoutMutation.mutateAsync;
  const antiFraudCheckMutationFn = antiFraudCheckMutation.mutateAsync;

  const handleProjectCreation = useCallback(
    async ({
      isCreditPayment = false,
      creditAmount = 0,
    }: {
      isCreditPayment?: boolean;
      creditAmount?: number;
    }) => {
      // Step 1: Setup infrastructure config
      await infraConfigMutationFn();

      // Step 2: Setup credit config if needed
      if (isCreditPayment) {
        await creditConfigMutationFn({ creditAmount });
      }

      // Step 3: Check if payment required
      const { paymentRequired } = await checkPaymentRequiredMutationFn();

      if (!paymentRequired) {
        // Step 4: If no payment required, proceed with checkout
        const cartSummary = await checkoutMutationFn();

        // Step 5: Run anti-fraud check
        await antiFraudCheckMutationFn(cartSummary);
      }
    },
    [
      infraConfigMutationFn,
      creditConfigMutationFn,
      checkPaymentRequiredMutationFn,
      checkoutMutationFn,
      antiFraudCheckMutationFn,
    ],
  );

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
    setVoucherCode,
    isSubmitting,
    needToCheckCustomerInfo,
    billingHref,
  };
};
