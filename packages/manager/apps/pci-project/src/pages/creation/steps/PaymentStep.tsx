import { useContext, useState } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
import { GlobalStateStatus } from '@/types/WillPayment.type';
import WillPaymentComponent from '../components/payment/WillPayment.component';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
  onPaymentStatusChange?: (willPaymentStatus: GlobalStateStatus) => void;
  onRegisteredPaymentMethodSelected: (event: CustomEvent) => void;
};

type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
  paymentMethod: TPaymentMethod | undefined;
  isAsDefault: boolean;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
  onPaymentStatusChange,
  onRegisteredPaymentMethodSelected,
}: Readonly<PaymentStepProps>) {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    voucherConfiguration: undefined,
    paymentMethod: undefined,
    isAsDefault: false,
  });

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();

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

      <WillPaymentComponent
        config={{
          baseUrl: window.location.origin,
          onChange: (state: GlobalStateStatus) =>
            onPaymentStatusChange?.(state),
          subsidiary: user.ovhSubsidiary,
          language: user.language,
          hostApp: 'pci',
        }}
        onRegisteredPaymentMethodSelected={onRegisteredPaymentMethodSelected}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
