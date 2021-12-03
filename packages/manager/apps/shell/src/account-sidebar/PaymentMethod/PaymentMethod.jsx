import React, { useState, useEffect } from 'react';

import usePaymentMethod from './usePaymentMethod';

import Icon from './Icon.jsx';
import Details from './Details.jsx';

import './index.scss';

const PaymentMehtod = ({ environment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState();

  const { getDefaultPaymentMethod, isEnterpriseAccount } =
    usePaymentMethod(environment);
  const cssBaseClassName = 'manager-account-sidebar-payment-method';
  const translationBase = 'payment_method';

  useEffect(() => {
    setIsLoading(true);

    if (!isEnterpriseAccount()) {
      getDefaultPaymentMethod()
        .then((paymentMethod) => {
          setDefaultPaymentMethod(paymentMethod);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return (
    !isEnterpriseAccount() && (
      <div className={`${cssBaseClassName} mb-4`}>
        <a className="d-flex flex-row align-items-center p-2">
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

export default PaymentMehtod;
