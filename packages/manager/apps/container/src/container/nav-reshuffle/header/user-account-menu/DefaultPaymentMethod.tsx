import { useTranslation } from 'react-i18next';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import style from './style.module.scss';
import { PaymentMethodType } from '@/container/legacy/account-sidebar/PaymentMethod/usePaymentMethod';
import { useShell } from '@/context';

type Props = {
  defaultPaymentMethod?: PaymentMethodType;
  isLoading?: boolean;
  onPaymentMethodLinkClick: () => void;
};

const UserDefaultPaymentMethod = ({
  defaultPaymentMethod = {},
  isLoading = false,
  onPaymentMethodLinkClick,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');
  const shell = useShell();
  const paymentMethodUrl = shell
    .getPlugin('navigation')
    .getURL('billing', '#/payment/method');

  const getChipColor = () => {
    return ODS_THEME_COLOR_INTENT[
      defaultPaymentMethod.getStatusCategory() as ODS_THEME_COLOR_INTENT
    ];
  };

  return (
    <div
      className={`${style.defaultPaymentMethod} my-1`}
      id="user-account-menu-payment-method"
    >
      {!isLoading && defaultPaymentMethod && (
        <div
          className={`d-flex mt-1 justify-content-between ${style.menuContentRow}`}
        >
          <span>{t('user_account_menu_payment_method_title')}</span>

          <a href={paymentMethodUrl} onClick={onPaymentMethodLinkClick}>
            <OsdsChip
              color={getChipColor()}
              className={style.menuContentRowChip}
              selectable={true}
            >
              {t(
                `user_account_menu_payment_method_status_${defaultPaymentMethod.status}`,
              )}
            </OsdsChip>
          </a>
        </div>
      )}
    </div>
  );
};

export default UserDefaultPaymentMethod;
