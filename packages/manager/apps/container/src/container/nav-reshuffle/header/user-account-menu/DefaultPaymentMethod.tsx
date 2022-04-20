import React from 'react';

import { useTranslation } from 'react-i18next';
import { buildURL } from '@ovh-ux/ufrontend';

import style from './style.module.scss';

type Props = {
  defaultPaymentMethod?: unknown;
  isLoading?: boolean;
};

const UserDefaultPaymentMethod = ({
  defaultPaymentMethod = {},
  isLoading = false,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');

  // @todo: use navigation plugin instead
  const paymentMethodUrl = buildURL('dedicated', '#/billing/payment/method');

  return (
    <div className={`${style.defaultPaymentMethod} my-1`}>
      <a
        className="d-flex flex-row align-items-center p-2"
        href={paymentMethodUrl}
        target="_top"
      >
        <div className="m-auto p-1 minw-0 w-100">
          <h2>{t('user_account_menu_payment_method_title')}</h2>
          {isLoading && (
            <div>
              <div className="oui-skeleton oui-skeleton_s">
                <div className="oui-skeleton__loader"></div>
              </div>
              <div className="oui-skeleton oui-skeleton_s">
                <div className="oui-skeleton__loader"></div>
              </div>
            </div>
          )}
          {!isLoading && defaultPaymentMethod && (
            <div className={`${style.defaultPaymentMethod_label}`}>
              <p className="mb-1 text-truncate">{defaultPaymentMethod.label}</p>
              <span
                className={`${
                  style.defaultPaymentMethod_status
                } oui-badge oui-badge_${defaultPaymentMethod.getStatusCategory()}`}
              >
                {t(
                  `user_account_menu_payment_method_status_${defaultPaymentMethod.status}`,
                )}
              </span>
            </div>
          )}
          {!isLoading && !defaultPaymentMethod && (
            <p>{t('user_account_menu_payment_method_none')}</p>
          )}
        </div>
        <span
          className="ml-auto oui-icon oui-icon-arrow-right"
          aria-hidden="true"
        ></span>
      </a>
    </div>
  );
};

export default UserDefaultPaymentMethod;
