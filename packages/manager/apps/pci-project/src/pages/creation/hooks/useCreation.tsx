import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TFunction } from 'i18next';
import { useCallback, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Cart,
  CartSummary,
  OrderedProduct,
  PaymentMean,
} from '@/data/types/cart.type';
import {
  checkoutCart,
  getCartCheckout,
  attachConfigurationToCartItem as postAttachConfigurationToCartItem,
} from '@/data/api/cart';
import { AntiFraudError, PCI_PROJECT_ORDER_CART } from '@/constants';
import useAntiFraud from './useAntiFraud';
import { payWithRegisteredPaymentMean } from '@/data/api/payment';

export type UseCreationProps = {
  t: TFunction;
  cart?: Cart;
  projectItem?: OrderedProduct;
};

export const useCreation = ({
  t,
  cart,
  projectItem,
}: Readonly<UseCreationProps>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needToCheckCustomerInfo, setNeedToCheckCustomerInfo] = useState(false);
  const [billingHref, setBillingHref] = useState('');

  const navigate = useNavigate();
  const { checkAntiFraud } = useAntiFraud();
  const { addError, addWarning } = useNotifications();
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const [searchParams] = useSearchParams();
  const voucherCode = searchParams.get('voucher');

  const handleCreationError = useCallback(
    (error: unknown) => {
      const antiFraudError = error as AntiFraudError;
      if (antiFraudError === AntiFraudError.CASE_FRAUD_REFUSED) {
        addError(
          t('pci_project_new_payment_check_anti_fraud_case_fraud_refused', {
            ns: 'new/payment',
          }),
        );
      } else if (antiFraudError === AntiFraudError.NEED_CUSTOMER_INFO_CHECK) {
        setNeedToCheckCustomerInfo(true);
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
    },
    [addError, addWarning, navigate],
  );

  const handleProjectCreation = useCallback(async () => {
    if (!cart || !projectItem) {
      return;
    }

    setIsSubmitting(true);

    postAttachConfigurationToCartItem(cart.cartId, projectItem.itemId, {
      label: 'infrastructure',
      value: PCI_PROJECT_ORDER_CART.infraConfigValue,
    })
      .then(() => getCartCheckout(cart.cartId))
      .then(() => checkoutCart(cart.cartId))
      .then((cartFinalized: CartSummary) => {
        if (cartFinalized?.orderId) {
          if (cartFinalized?.prices.withTax.value === 0) {
            return payWithRegisteredPaymentMean(cartFinalized?.orderId, {
              paymentMean: PaymentMean.FIDELITY_ACCOUNT,
            }).then(() => cartFinalized);
          }

          navigation
            .getURL('dedicated', '#/billing/orders/:orderId', {
              orderId: cartFinalized.orderId,
            })
            .then((url) => setBillingHref(`${url}`));
        }
        return cartFinalized;
      })
      .then((cartFinalized: CartSummary) => {
        if (cartFinalized?.orderId) {
          return checkAntiFraud(cartFinalized).then(() => {
            const redirectPath = voucherCode
              ? `../creating/${cartFinalized.orderId}/${voucherCode}`
              : `../creating/${cartFinalized.orderId}`;
            navigate(redirectPath);
            return cartFinalized;
          });
        }
        return null;
      })
      .catch((error) => {
        handleCreationError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [
    cart,
    projectItem,
    navigation,
    voucherCode,
    checkAntiFraud,
    navigate,
    handleCreationError,
  ]);

  return {
    handleProjectCreation,
    isSubmitting,
    needToCheckCustomerInfo,
    billingHref,
  };
};
