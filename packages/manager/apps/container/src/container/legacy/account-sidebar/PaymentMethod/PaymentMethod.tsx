import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import Details from './Details';
import Icon from './Icon';
import usePaymentMethod, { PaymentMethodType } from './usePaymentMethod';

import { useShell } from '@/context';

import './index.scss';

const PaymentMethod = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<
    PaymentMethodType
  >();
  const shell = useShell();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();

  const { getDefaultPaymentMethod, isEnterpriseAccount } = usePaymentMethod(
    environment,
  );
  const cssBaseClassName = 'manager-account-sidebar-payment-method';
  const translationBase = 'user_account_menu_payment_method';

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  useEffect(() => {
    setIsLoading(true);

    if (!isEnterpriseAccount()) {
      getDefaultPaymentMethod()
        .then((paymentMethod: PaymentMethodType) => {
          setDefaultPaymentMethod(paymentMethod);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const paymentMethodClickHandler = () =>
    shell.getPlugin('tracking').trackClick({
      name: 'hub::sidebar::payment::go-to-payment-method',
      type: 'action',
    });

  return (
    !isEnterpriseAccount() && (
      <div className={`${cssBaseClassName} mb-4`}>
        <a
          className="d-flex flex-row align-items-center p-2"
          href={paymentMethodURL}
          target="_top"
          onClick={paymentMethodClickHandler}
        >
          <Icon defaultPaymentMethod={defaultPaymentMethod} />
          {isLoading ? (
            <div className="oui-skeleton oui-skeleton_s">
              <div className="oui-skeleton__loader"></div>
            </div>
          ) : (
            <Details
              defaultPaymentMethod={defaultPaymentMethod}
              translationBase={translationBase}
              cssBaseClassName={cssBaseClassName}
            />
          )}
          <span
            className="ml-auto oui-icon oui-icon-arrow-right"
            aria-hidden="true"
          ></span>
        </a>
      </div>
    )
  );
};

export default PaymentMethod;
