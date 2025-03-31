import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useApplication } from '@/context';
import './styles.scss';
import { useModals } from '@/context/modals';

export interface IPaymentMethod {
  icon?: {
    data?: string;
    name: string;
    url?: string;
  };
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

const PaymentModal = (): JSX.Element => {
  const { t } = useTranslation('payment-modal');
  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const { shell } = useApplication();
  const { data: alert } = useModals();

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  const closeHandler = () => {
    setShowPaymentModal(false);
    shell.getPlugin('ux').notifyModalActionDone('PaymentModal');
  };
  const validateHandler = () => {
    setShowPaymentModal(false);
    window.location.href = paymentMethodURL;
  };

  return (
    showPaymentModal && (
      <OsdsModal
        onOdsModalClose={closeHandler}
        headline={t('payment_modal_title')}
        color={ODS_THEME_COLOR_INTENT.info}
        data-testid="paymentModal"
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
          onClick={validateHandler}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('payment_modal_action_validate')}
        </OsdsButton>
      </OsdsModal>
    )
  );
};

export default PaymentModal;
