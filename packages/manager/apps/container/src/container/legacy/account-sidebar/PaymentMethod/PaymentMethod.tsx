import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import Details from './Details';
import Icon from './Icon';
import usePaymentMethod, { PaymentMethodType } from './usePaymentMethod';

import { useShell } from '@/context';
import { OsdsSkeleton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

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
          className="flex flex-row items-center p-2"
          href={paymentMethodURL}
          target="_top"
          onClick={paymentMethodClickHandler}
        >
          <Icon defaultPaymentMethod={defaultPaymentMethod} />
          {isLoading ? (
            <OsdsSkeleton/>
          ) : (
            <Details
              defaultPaymentMethod={defaultPaymentMethod}
              translationBase={translationBase}
            />
          )}
          <OsdsIcon
            aria-hidden="true"
            name={ODS_ICON_NAME.ARROW_RIGHT}
            className="ml-auto"
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </a>
      </div>
    )
  );
};

export default PaymentMethod;
