import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TCreditData } from '@/types/WillPayment.type';

interface CreditConfirmationProps {
  creditAmount: TCreditData['creditAmount'];
}

const CreditConfirmation: React.FC<CreditConfirmationProps> = ({
  creditAmount,
}) => {
  const { t } = useTranslation([
    'payment/integrations/credit/confirmation',
    'new/payment',
  ]);

  return (
    <div className="flex flex-col gap-6">
      <OdsText className="font-bold">
        {t('pci_project_new_payment_credit_thanks', {
          ns: 'payment/integrations/credit/confirmation',
        })}
      </OdsText>

      <OdsText>
        {t('pci_project_new_payment_credit_explain', {
          ns: 'payment/integrations/credit/confirmation',
          amount: creditAmount?.text,
        })}
      </OdsText>

      <OdsText preset={ODS_TEXT_PRESET.caption}>
        {t('pci_project_new_payment_credit_info', {
          ns: 'payment/integrations/credit/confirmation',
        })}
      </OdsText>
    </div>
  );
};

export default CreditConfirmation;
