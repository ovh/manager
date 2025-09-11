import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
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
import { useCheckModalDisplay } from '@/hooks/modal/useModal';
import {
  useExpiredDefaultCreditCardAlert,
} from '@/hooks/paymentMethod/usePaymentMethod';
import { hasExpiredDefaultCreditCardAlert } from '@/helpers/paymentMethod/paymentMethodHelper';

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

const PaymentModal: FC = () => {
  const { t } = useTranslation('payment-modal');
  const { shell } = useApplication();
  const ux = shell.getPlugin('ux');
  
  const shouldDisplayModal = useCheckModalDisplay(
    useExpiredDefaultCreditCardAlert,
    hasExpiredDefaultCreditCardAlert,
  );

  const [showPaymentModal, setShowPaymentModal] = useState(shouldDisplayModal);
  const { data: alert } = useExpiredDefaultCreditCardAlert(Boolean(shouldDisplayModal));

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  const closeHandler = () => {
    setShowPaymentModal(false);
    ux.notifyModalActionDone(PaymentModal.name);
  };
  const validateHandler = () => {
    setShowPaymentModal(false);
    window.location.href = paymentMethodURL;
  };
  
  useEffect(() => {
    if (shouldDisplayModal !== undefined) {
      setShowPaymentModal(shouldDisplayModal);
      if (!shouldDisplayModal) {
        ux.notifyModalActionDone(PaymentModal.name);
      }
    }
  }, [shouldDisplayModal]);

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
