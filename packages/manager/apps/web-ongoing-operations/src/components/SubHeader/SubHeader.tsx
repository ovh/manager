import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TOngoingOperations } from '@/types';
import config from '@/web-ongoing-operations.config';

interface SubHeaderProps {
  readonly domain: TOngoingOperations;
}

export default function SubHeader({ domain }: SubHeaderProps) {
  const { t } = useTranslation('dashboard');
  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav.getURL(config.rootLabel, '/domain', {}).then((data) => {
      setUrl(data as string);
    });
  }, []);

  return (
    <section className="mb-4 flex flex-col gap-y-2">
      <OdsLink href={url} icon="arrow-left" iconAlignment="left" label="Back" />
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('tracking_transfert_domain_title', {
          t0: domain?.domain,
        })}
      </OdsText>
    </section>
  );
}
