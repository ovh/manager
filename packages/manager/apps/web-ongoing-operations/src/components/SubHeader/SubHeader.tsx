import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { urls } from '@/routes/routes.constant';
import { TOngoingOperations } from '@/types';

interface SubHeaderProps {
  readonly domain: TOngoingOperations;
}

export default function SubHeader({ domain }: SubHeaderProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <section className="mb-4 flex flex-col gap-y-2">
      <OdsLink
        href="“#"
        icon="arrow-left"
        iconAlignment="left"
        label="Back"
        onClick={() => navigate(urls.domain)}
      />
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {`${t('tracking_transfert_domain_title')} ${domain.domain}`}
      </OdsText>
    </section>
  );
}
