import React from 'react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanPlanedChangeStatus } from '@/types/api.type';

type TRenewModal = {
  periodEndAction: SavingsPlanPlanedChangeStatus;
  onClose: () => void;
  onConfirm: () => void;
};

export default function RenewModal({
  periodEndAction,
  onClose,
  onConfirm,
}: Readonly<TRenewModal>) {
  const { t } = useTranslation('renew');

  return (
    <OdsModal onOdsClose={onClose}>
      <OdsText preset="heading-3">{t('title')}</OdsText>

      <slot name="content">
        <div className="mt-5">
          <OdsText preset="span">
            {t(
              periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE
                ? 'message_deactivate'
                : 'message_activate',
            )}
          </OdsText>
        </div>
      </slot>
      <OdsButton
        label={t('buttons_cancel')}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      />

      <OdsButton
        label={t(
          periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE
            ? 'buttons_deactivate'
            : 'buttons_activate',
        )}
        onClick={onConfirm}
        data-testid="renewModal-button_confirm"
      />
    </OdsModal>
  );
}
