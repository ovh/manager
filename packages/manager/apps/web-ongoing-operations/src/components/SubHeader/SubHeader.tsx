import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import config from '@/web-ongoing-operations.config';

interface SubHeaderProps {
  readonly title: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const { data: customUrl } = useNavigationGetUrl([config.rootLabel, '', {}]);
  const url = `${customUrl as string}/domain`;

  return (
    <section className="mb-8 flex flex-col gap-y-2">
      <Link
        href={url}
        icon="arrow-left"
        iconAlignment="left"
        label={tAction('back_to_list')}
        isDisabled={!url}
      />
      <Text preset={TEXT_PRESET.heading3}>{title}</Text>
    </section>
  );
}
