import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

import {
  NO_DEFAULT_CARD,
  EXPIRED_CARD,
  SOON_EXPIRED_CARD
} from './constants';

import './styles.scss';

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

interface IPaymentMethodResponse {
  data: IPaymentMethod[];
}

const PaymentModal = (): JSX.Element => {
  const [mode, setMode] = useState('');
  const { t } = useTranslation('payment-modal');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const shell = useShell();

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  useEffect(() => {
    const getPaymentMethods = async () => {
      const paymentResponse: IPaymentMethodResponse = await fetchIcebergV6({ route: '/me/payment/method' });
      const hasDefaultPaymentMethod = paymentResponse.data && paymentResponse.data.length > 0 && paymentResponse.data.find(currentPaymentMethod => currentPaymentMethod.default);
      let creditCardExpirationDate: Date;
      let currentDateMinus30Days: Date;
      let hasExpiredCreditCard = false;
      let isSoonToBeExpireCreditCard = false;
      const currentCreditCard = paymentResponse.data && paymentResponse.data.length > 0 && paymentResponse.data.find(currentPaymentMethod => currentPaymentMethod.paymentType === 'CREDIT_CARD');
      if (currentCreditCard) {
        creditCardExpirationDate = new Date(currentCreditCard.expirationDate);
        currentDateMinus30Days = new Date();
        currentDateMinus30Days.setDate(currentDateMinus30Days.getDate() - 30);
        hasExpiredCreditCard = creditCardExpirationDate.getTime() < Date.now();
        isSoonToBeExpireCreditCard = currentDateMinus30Days.getTime() > Date.now() && creditCardExpirationDate.getTime() > Date.now();
      }
      if (!hasDefaultPaymentMethod || hasExpiredCreditCard || isSoonToBeExpireCreditCard) {
        if (!hasDefaultPaymentMethod) {
          setMode(NO_DEFAULT_CARD);
        } else if (hasExpiredCreditCard) {
          setMode(EXPIRED_CARD);
        } else {
          setMode(SOON_EXPIRED_CARD);
        }
        setShowPaymentModal(true);
      }
    }
    getPaymentMethods();

  }, []);

  return (
    <Modal size="lg" centered show={showPaymentModal} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>{t('payment_modal_title')}<a href="#" onClick={() => setShowPaymentModal(false)} className="close"></a></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row modal-description">
          {mode === EXPIRED_CARD && <p>{t('payment_modal_description_expired')}</p>}
          {mode === NO_DEFAULT_CARD && <p>{t('payment_modal_description_no_default')}</p>}
          {mode === SOON_EXPIRED_CARD && <p>{t('payment_modal_description_soon_expired')}</p>}
          <p>{t('payment_modal_description_sub')}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="oui-button modal-logout"
          onClick={() => setShowPaymentModal(false)}
        >
          {t('payment_modal_action_cancel')}
        </button>
        <button
          type="button"
          className="oui-button oui-button_primary modal-logout"
          onClick={() => window.location.href = paymentMethodURL}
        >
          {t('payment_modal_action_validate')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;

