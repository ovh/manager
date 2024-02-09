import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useShell } from '@/context';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

import { PAYMENT_ALERTS } from './constants';

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

const PaymentModal = (): JSX.Element => {
  const [alert, setAlert] = useState('');
  const { t } = useTranslation('payment-modal');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const shell = useShell();

  const paymentMethodURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/billing/payment/method');

  const closeHandler = () => setShowPaymentModal(false);

  const computeAlert = (paymentMethods: IPaymentMethod[]): string => {
    let alert: string = null
    const hasDefaultPaymentMethod: IPaymentMethod = paymentMethods?.find(currentPaymentMethod => currentPaymentMethod.default);
    if (!hasDefaultPaymentMethod) {
      alert = PAYMENT_ALERTS.NO_DEFAULT;
    } else {
      const currentCreditCard: IPaymentMethod = paymentMethods?.find(currentPaymentMethod => currentPaymentMethod.paymentType === 'CREDIT_CARD');
      if (currentCreditCard) {
        const creditCardExpirationDate: Date = new Date(currentCreditCard.expirationDate);
        if (creditCardExpirationDate.getTime() < Date.now()) {
          alert = PAYMENT_ALERTS.EXPIRED_CARD;
        } else {
          const currentDateMinus30Days: Date = new Date();
          currentDateMinus30Days.setDate(currentDateMinus30Days.getDate() - 30);
          const isSoonToBeExpireCreditCard: boolean = currentDateMinus30Days.getTime() > Date.now() && creditCardExpirationDate.getTime() > Date.now();
          if (isSoonToBeExpireCreditCard) {
            alert = PAYMENT_ALERTS.SOON_EXPIRED_CARD;
          }
        }
      }
    }
    return alert;
  };

  const { data: paymentResponse } = useQuery(['me-payment-method'], () => fetchIcebergV6<IPaymentMethod>({ route: '/me/payment/method' }));

  useEffect(() => {
    if (paymentResponse) {
      const alert = computeAlert(paymentResponse.data);
      if (alert) {
        setAlert(alert);
        setShowPaymentModal(true);
      }
    }

  }, [paymentResponse]);

  return (
    <Modal size="lg" centered show={showPaymentModal} backdrop="static" keyboard={false} onHide={closeHandler}>
      <Modal.Header closeButton>
        <Modal.Title>{t('payment_modal_title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4">
          <p>{t(`payment_modal_description_${alert}`)}</p>
          <p>{t('payment_modal_description_sub')}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="oui-button oui-button_secondary"
          onClick={closeHandler}
        >
          {t('payment_modal_action_cancel')}
        </button>
        <button
          type="button"
          className="oui-button oui-button_primary"
          onClick={() => window.location.href = paymentMethodURL}
        >
          {t('payment_modal_action_validate')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;

