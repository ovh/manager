import { useState } from 'react';
import PaymentMethods from '@/components/payment/PaymentMethods';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import Voucher from '../components/voucher/Voucher';
import StartupProgram from '../components/startup-program/StartupProgram';
import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
};

export type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
}: PaymentStepProps) {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    voucherConfiguration: undefined,
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

  return (
    <div className="flex flex-col gap-8">
      <Voucher
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        voucherConfiguration={paymentForm.voucherConfiguration}
        setVoucherConfiguration={handleVoucherConfigurationChange}
      />

      <PaymentMethods
        handlePaymentMethodChange={() => {}}
        handleSetAsDefaultChange={() => {}}
        paymentMethodHandler={() => {}}
        handleValidityChange={() => {}}
        handlePaymentMethodChallenge={true}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
