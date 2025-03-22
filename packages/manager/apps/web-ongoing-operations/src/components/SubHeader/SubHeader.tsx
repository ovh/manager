import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { TOngoingOperations } from '@/types';
import config from '@/web-ongoing-operations.config';

interface SubHeaderProps {
  readonly domain: TOngoingOperations;
}

export default function SubHeader({ domain }: SubHeaderProps) {
  const { t } = useTranslation('dashboard');
  const { data: url } = useNavigationGetUrl([config.rootLabel, '', {}]);

  return (
    <section className="mb-4 flex flex-col gap-y-2">
      <OdsLink
        href={`${url}/domain`}
        icon="arrow-left"
        iconAlignment="left"
        label={t('back_link')}
        isDisabled={!url}
      />
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('tracking_transfert_domain_title', {
          t0: domain?.domain,
        })}
      </OdsText>
    </section>
  );
}
