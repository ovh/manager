import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import { PaymentMethodType } from '@/container/legacy/account-sidebar/PaymentMethod/usePaymentMethod';
import { OsdsChip } from '@ovhcloud/ods-stencil/components/react';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';

type Props = {
  defaultPaymentMethod?: PaymentMethodType;
  isLoading?: boolean;
};

const UserDefaultPaymentMethod = ({
  defaultPaymentMethod = {},
  isLoading = false,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');

  const getChipColor = () => {
    return OdsThemeColorIntent[
      defaultPaymentMethod.getStatusCategory() as OdsThemeColorIntent
    ];
  };

  return (
    <div
      className={`${style.defaultPaymentMethod} my-1`}
      id="user-account-menu-payment-method"
    >
      {!isLoading && defaultPaymentMethod && (
        <div className="d-flex mt-1 justify-content-between">
          <span>{t('user_account_menu_payment_method_title')}</span>
          <OsdsChip color={getChipColor()}>
            {t(
              `user_account_menu_payment_method_status_${defaultPaymentMethod.status}`,
            )}
          </OsdsChip>
        </div>
      )}
    </div>
  );
};

export default UserDefaultPaymentMethod;
