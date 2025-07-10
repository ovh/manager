import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormatDateOptions,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsBadge,
  OdsCard,
  OdsLink,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_CARD_COLOR,
  ODS_LINK_ICON_ALIGNMENT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  TUserPaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import PaymentIcon from './PaymentIcon';

export type DefaultPaymentMethodProps = {
  method: TUserPaymentMethod;
};

const CREDIT_BANK_LIST = [
  TPaymentMethodType.BANK_ACCOUNT,
  TPaymentMethodType.CREDIT_CARD,
];

const getFormatCreditCardNumber = (method: TUserPaymentMethod): string => {
  const { label, paymentType } = method;

  if (!label) {
    return '';
  }

  if (CREDIT_BANK_LIST.includes(paymentType)) {
    return `····${label.substring(label.length - 4, label.length)}`;
  }

  return label;
};

const getFormatExpirationDate = (
  method: TUserPaymentMethod,
  formatDate: (opts: FormatDateOptions) => string,
): string => {
  if (!method.expirationDate) {
    return '';
  }

  return formatDate({ date: method.expirationDate, format: 'MM/yyyy' });
};

const DefaultPaymentMethod: React.FC<DefaultPaymentMethodProps> = ({
  method,
}) => {
  const { t } = useTranslation('payment/default');
  const formatDate = useFormatDate();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [billingHref, setBillingHref] = React.useState<string>('');

  useEffect(() => {
    navigation
      .getURL('dedicated', '#/billing/payment/method', {})
      .then((url) => setBillingHref(`${url}`));
  }, [navigation]);

  return (
    <div>
      <OdsText className="mb-6" preset={ODS_TEXT_PRESET.heading2}>
        {t('pci_project_new_payment_default_title')}
      </OdsText>

      <OdsText className="text-justify">
        {t('pci_project_new_payment_default_explain_info')}
      </OdsText>

      <div>
        <OdsCard
          color={ODS_CARD_COLOR.neutral}
          className="flex items-center p-6 gap-6 my-6"
        >
          <PaymentIcon icon={method.icon} />

          <span className="font-bold mr-12">
            {getFormatCreditCardNumber(method)}
          </span>

          {method.expirationDate && (
            <OdsBadge
              color={ODS_BADGE_COLOR.neutral}
              label={t(
                'pci_project_new_payment_default_method_expiration_date',
                {
                  formatDate: getFormatExpirationDate(method, formatDate),
                },
              )}
            />
          )}

          <OdsBadge
            label={t('pci_project_new_payment_default_method_badge_default')}
          />
        </OdsCard>
      </div>

      <OdsLink
        label={t(
          'pci_project_new_payment_default_method_use_others_payment_methods',
        )}
        href={billingHref}
        target="_blank"
        rel="noopener"
        icon="external-link"
        iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
      />
    </div>
  );
};

export default DefaultPaymentMethod;
