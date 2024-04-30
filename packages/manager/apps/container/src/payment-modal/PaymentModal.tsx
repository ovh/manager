import React, { useEffect, useState } from 'react';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { PAYMENT_ALERTS } from './constants';
import './styles.scss';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

interface IPaymentMethod {
  icon?: any;
  label: string;
  status: string;
  default: boolean;
  oneclick: boolean;
  lastUpdate: string;
  description: string;
  integration: string;
  paymentType: string;
  creationDate: string;
  paymentMeanId: number;
  expirationDate?: string;
  paymentSubType: string;
  paymentMethodId: number;
}

const computeAlert = (paymentMethods: IPaymentMethod[]): string => {
  if (!paymentMethods?.some(currentPaymentMethod => currentPaymentMethod.default)) {
    return PAYMENT_ALERTS.NO_DEFAULT;
  }
  const currentCreditCard: IPaymentMethod = paymentMethods?.find(currentPaymentMethod => currentPaymentMethod.paymentType === 'CREDIT_CARD');
  
  if (currentCreditCard) {
    const creditCardExpirationDate = new Date(currentCreditCard.expirationDate);
    if (creditCardExpirationDate.getTime() < Date.now()) {
      return PAYMENT_ALERTS.EXPIRED_CARD;
    }
    const expirationDateMinus30Days = new Date();
    expirationDateMinus30Days.setDate(expirationDateMinus30Days.getDate() - 30);
    const isSoonToBeExpireCreditCard = expirationDateMinus30Days.getTime() < Date.now();
    if (isSoonToBeExpireCreditCard) {
      return PAYMENT_ALERTS.SOON_EXPIRED_CARD;
    }
  }
  return null;
};

const PaymentModal = (): JSX.Element => {
  const [alert, setAlert] = useState('');
  const { t } = useTranslation('payment-modal');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const shell = useShell();

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  const closeHandler = () => setShowPaymentModal(false);

  const { data: paymentResponse } = useQuery({
    queryKey: ['me-payment-method'],
    queryFn: () => fetchIcebergV6<IPaymentMethod>({ route: '/me/payment/method' })
  });

  useEffect(() => {
    if (paymentResponse) {
      const alert = computeAlert(paymentResponse.data);
      if (alert) {
        setAlert(alert);
        setShowPaymentModal(true);
      }
    }
  }, [paymentResponse]);

  return !showPaymentModal ? (
    <></>
  ) : (
    <OsdsModal
      onOdsModalClose={closeHandler}
      headline={t('payment_modal_title')}
      color={ODS_THEME_COLOR_INTENT.info}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        <p>{t(`payment_modal_description_${alert}`)}</p>
        <p>{t('payment_modal_description_sub')}</p>
      </OsdsText>

      <OsdsButton
        onClick={closeHandler}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('payment_modal_action_cancel')}
      </OsdsButton>

      <OsdsButton
        onClick={() => (window.location.href = paymentMethodURL)}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('payment_modal_action_validate')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default PaymentModal;
