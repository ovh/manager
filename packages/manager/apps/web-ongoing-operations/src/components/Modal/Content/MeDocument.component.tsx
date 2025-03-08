import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import config from '@/web-ongoing-operations.config';

interface MeDocumentComponentProps {
  readonly argumentKey: string;
  readonly operationID: number;
}

export default function MeDocumentComponent({
  argumentKey,
  operationID,
}: MeDocumentComponentProps) {
  const { t } = useTranslation('dashboard');
  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav
      .getURL(config.rootLabel, `/upload/${operationID}/${argumentKey}`, {})
      .then((data) => {
        setUrl(data as string);
      });
  }, []);

  return (
    <OdsLink
      label={t(`domain_operations_update_nicowner_click_${argumentKey}`)}
      icon="external-link"
      className="mb-1 block"
      href={url}
      data-testid="documentModal"
    />
  );
}
