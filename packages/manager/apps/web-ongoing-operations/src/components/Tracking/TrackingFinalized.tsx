import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
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
        <Icon name="check" className="text-success text-2xl mb-4" />
        <Text preset={TEXT_PRESET.heading3}>
          {t('tracking_transfert_finalized')}
        </Text>
      </div>
      <Text className="mb-8" preset={TEXT_PRESET.paragraph}>
        {t('tracking_transfert_sub_finalized')}
      </Text>
      <Button onClick={() => navigate(urls.root)}>
        {t('tracking_transfert_back_to_domain')}
      </Button>
    </div>
  );
}
