import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

type SepaInformationModalProps = {
  features: TPaymentFeaturesState;
  handleSepaModalShown: () => void;
  isAlreadyShown: boolean;
};

const SepaInformationModal: React.FC<SepaInformationModalProps> = ({
  features,
  handleSepaModalShown,
  isAlreadyShown = false,
}) => {
  const { t } = useTranslation('payment/register/sepa-modal');
  const [isOpen, setIsOpen] = React.useState<boolean>(
    features.SEPA_INFO_MSG && !isAlreadyShown,
  );

  useEffect(() => (isOpen ? handleSepaModalShown() : undefined), [isOpen]);

  return (
    <OdsModal
      isOpen={isOpen}
      onOdsClose={() => setIsOpen(false)}
      isDismissible={true}
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-6">
        {t('ovh_payment_method_register_sepa_information_modal_title')}
      </OdsText>

      <OdsText className="mb-3">
        <span
          dangerouslySetInnerHTML={{
            __html: t(
              'ovh_payment_method_register_sepa_information_modal_part_1',
            ),
          }}
        />
      </OdsText>
      <OdsText className="mb-3">
        <strong>
          {t('ovh_payment_method_register_sepa_information_modal_part_2')}
        </strong>
      </OdsText>

      <OdsButton
        slot="actions"
        label={t('ovh_payment_method_register_sepa_information_modal_confirm')}
        onClick={() => setIsOpen(false)}
      />
    </OdsModal>
  );
};

export default SepaInformationModal;
