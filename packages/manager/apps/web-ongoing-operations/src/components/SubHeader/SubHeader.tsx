import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import config from '@/web-ongoing-operations.config';

interface SubHeaderProps {
  readonly title: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
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
      <OdsText preset={ODS_TEXT_PRESET.heading3}>{title}</OdsText>
    </section>
  );
}
