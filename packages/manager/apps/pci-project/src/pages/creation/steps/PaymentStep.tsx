import PaymentMethods from '@/components/payment/PaymentMethods';
import {
  useIsStartupProgramAvailable,
  useStartupProgram,
} from '@/data/hooks/useCredit';
import { CartConfiguration } from '@/data/types/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import { useCallback, useState } from 'react';
import PaypalPayment from '../components/paypal/PaypalPayment';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';

type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
  paymentMethod: TPaymentMethod | undefined;
  isAsDefault: boolean;
};

type PaymentStepProps = {
  cart: { cartId: string };
  cartProjectItem: { itemId: string };
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

  const { data: isStartupProgramAvailable } = useIsStartupProgramAvailable();
  const { data: startupProgramBalance } = useStartupProgram(
    isStartupProgramAvailable ?? false,
  );

  const handleVoucherConfigurationChange = (
    voucherConfiguration: CartConfiguration | undefined,
  ) => {
    setPaymentForm((prev) => ({
      ...prev,
      voucherConfiguration,
    }));
  };

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

      {isStartupProgramAvailable && (
        <StartupProgram value={startupProgramBalance?.amount.text} />
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
