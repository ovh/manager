import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaymentMethods, {
  TPaymentMethodRef,
} from '@/components/payment/PaymentMethods';

import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import { TPaymentMethod } from '@/data/types/payment/payment-method.type';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
  handleIsPaymentMethodValid: (isValid: boolean) => void;
  paymentHandler: React.Ref<TPaymentMethodRef>;
  handleCustomSubmitButton: (btn: string | JSX.Element) => void;
  onPaymentSubmit: ({
    paymentMethodId,
    skipRegistration,
  }: {
    paymentMethodId?: number;
    skipRegistration?: boolean;
  }) => Promise<unknown>;
};

type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
  paymentMethod: TPaymentMethod | undefined;
  isAsDefault: boolean;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
  handleIsPaymentMethodValid,
  paymentHandler,
  handleCustomSubmitButton,
  onPaymentSubmit,
}: PaymentStepProps) {
  const [searchParams] = useSearchParams();
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
        paymentMethodHandler={paymentHandler}
        handleValidityChange={handleIsPaymentMethodValid}
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        handleCustomSubmitButton={handleCustomSubmitButton}
        preselectedPaymentType={searchParams.get('paymentType')}
        handlePaymentMethodChange={onPaymentMethodChange}
        handleSetAsDefaultChange={onSetAsDefaultChange}
        onPaymentSubmit={onPaymentSubmit}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
