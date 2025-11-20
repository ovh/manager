import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { TCreditData } from '@/types/UWillPayment.type';

interface CreditConfirmationProps {
  creditAmount: TCreditData['creditAmount'];
}

const CreditConfirmation: React.FC<CreditConfirmationProps> = ({ creditAmount }) => {
  const { t } = useTranslation('payment/credit');

  return (
    <div className="flex flex-col gap-6">
      <OdsText className="font-bold">{t('pci_project_new_payment_credit_thanks')}</OdsText>

      <OdsText>
        {t('pci_project_new_payment_credit_explain', {
          amount: creditAmount?.text,
        })}
      </OdsText>

      <OdsText preset={ODS_TEXT_PRESET.caption}>{t('pci_project_new_payment_credit_info')}</OdsText>
    </div>
  );
};

export default CreditConfirmation;
