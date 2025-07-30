import PaymentMethods from '@/components/payment/PaymentMethods';

import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import { useCallback, useState } from 'react';
import PaypalPayment from '../components/paypal/PaypalPayment';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
};

type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
  paymentMethod: TPaymentMethod | undefined;
  isAsDefault: boolean;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
}: PaymentStepProps) {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    voucherConfiguration: undefined,
    paymentMethod: undefined,
    isAsDefault: false,
  });

  const handleVoucherConfigurationChange = (
    voucherConfiguration: CartConfiguration | undefined,
  ) => {
    setPaymentForm((prev) => ({
      ...prev,
      voucherConfiguration,
    }));
  };

  const { data: isStartupProgramAvailable } = useIsStartupProgramAvailable();
  const { data: startupProgramAmountText } = useStartupProgramAmountText(
    isStartupProgramAvailable ?? false,
  );

  const onPaymentMethodChange = useCallback((method: TPaymentMethod) => {
    setPaymentForm((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  }, []);

  const onSetAsDefaultChange = useCallback((value: boolean) => {
    setPaymentForm((prev) => ({
      ...prev,
      isAsDefault: value,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Voucher
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        voucherConfiguration={paymentForm.voucherConfiguration}
        setVoucherConfiguration={handleVoucherConfigurationChange}
      />

      <PaymentMethods
        handlePaymentMethodChange={onPaymentMethodChange}
        handleSetAsDefaultChange={onSetAsDefaultChange}
        paymentMethodHandler={() => {}}
        handleValidityChange={() => {}}
        handlePaymentMethodChallenge={true}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}

      <div className="payment-integration">
        {paymentForm.paymentMethod?.paymentType ===
          TPaymentMethodType.PAYPAL && (
          <PaypalPayment
            isDefault={paymentForm.isAsDefault}
            isDisabled={false}
          />
        )}
      </div>
    </div>
  );
}
