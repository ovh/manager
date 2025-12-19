import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Icon, ICON_NAME, Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import config from '@/web-ongoing-operations.config';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

interface SubHeaderProps {
  readonly title: string;
}

export default function SubHeader({ title }: SubHeaderProps) {
  const { trackPageNavivationLink } = useTrackNavigation();
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const { data: customUrl } = useNavigationGetUrl([config.rootLabel, '', {}]);
  const url = `${customUrl as string}/domain`;

  return (
    <section className="mb-8 flex flex-col gap-y-2">
      <Link
        href={url}
        disabled={!url}
        onClick={() => {
          trackPageNavivationLink(url);
        }}
      >
        <Icon name={ICON_NAME.arrowLeft} />
        {tAction('back_to_list')}
      </Link>
      <Text preset={TEXT_PRESET.heading3}>{title}</Text>
    </section>
  );
}
