import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

interface MeContactComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly domainName: string;
}

export default function MeContactComponent({
  argumentKey,
  value,
  domainName,
}: MeContactComponentProps) {
  const { t } = useTranslation('dashboard');
  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav
      .getURL(
        'web',
        `#/domain/${domainName}/contact-management/edit-contact/${value}`,
        {},
      )
      .then((data) => {
        setUrl(data as string);
      });
  }, []);

  return (
    <OdsLink
      href={url}
      color="primary"
      label={t(`domain_operations_update_nicowner_click_${argumentKey}`)}
      className="block"
      target="_blank"
      icon="external-link"
      data-testid="contactModal"
    />
  );
}
