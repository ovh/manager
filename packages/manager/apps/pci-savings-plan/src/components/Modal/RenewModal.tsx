import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
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
    <OsdsModal headline={t('title')} onOdsModalClose={onClose}>
      <slot name="content">
        <div className="mt-5">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {t(
              periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE
                ? 'message_deactivate'
                : 'message_activate',
            )}
          </OsdsText>
        </div>
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('buttons_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        data-testid="renewModal-button_confirm"
      >
        {t(
          periodEndAction === SavingsPlanPlanedChangeStatus.REACTIVATE
            ? 'buttons_deactivate'
            : 'buttons_activate',
        )}
      </OsdsButton>
    </OsdsModal>
  );
}
