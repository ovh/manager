import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentMethods, {
  TPaymentMethodRef,
} from '@/components/payment/PaymentMethods';
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
  handleIsPaymentMethodValid: (isValid: boolean) => void;
  paymentHandler: React.Ref<TPaymentMethodRef>;
  handleCustomSubmitButton: (btn: string) => void;
};

export type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
  handleIsPaymentMethodValid,
  paymentHandler,
  handleCustomSubmitButton,
}: PaymentStepProps) {
  const [searchParams] = useSearchParams();
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
        paymentMethodHandler={paymentHandler}
        handleValidityChange={handleIsPaymentMethodValid}
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        handleCustomSubmitButton={handleCustomSubmitButton}
        preselectedPaymentType={searchParams.get('paymentType')}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
