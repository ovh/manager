import { OdsIcon, OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

export default function TrackingFinalized() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center mt-16"
      data-testid="done"
    >
      <div className="flex flex-col gap-y-3 items-center justify-center mb-4">
        <OdsIcon name="check" className="text-success text-2xl mb-4" />
        <OdsText preset={ODS_TEXT_PRESET.heading3}>
          {t('tracking_transfert_finalized')}
        </OdsText>
      </div>
      <OdsText className="mb-8" preset={ODS_TEXT_PRESET.paragraph}>
        {t('tracking_transfert_sub_finalized')}
      </OdsText>
      <OdsButton
        label={t('tracking_transfert_back_to_domain')}
        onClick={() => navigate(urls.root)}
      />
    </div>
  );
}
