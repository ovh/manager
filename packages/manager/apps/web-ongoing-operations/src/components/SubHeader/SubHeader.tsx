import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Icon, ICON_NAME, Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import config from '@/web-ongoing-operations.config';

interface SubHeaderProps {
  readonly title: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
  const { t } = useTranslation('dashboard');
  const { data: customUrl } = useNavigationGetUrl([config.rootLabel, '', {}]);
  const url = `${customUrl as string}/domain`;

  return (
    <section className="mb-8 flex flex-col gap-y-2">
      <Link href={url} disabled={!url}>
        <Icon name={ICON_NAME.arrowLeft} />
        {t('back_link')}
      </Link>
      <Text preset={TEXT_PRESET.heading3}>{title}</Text>
    </section>
  );
}
