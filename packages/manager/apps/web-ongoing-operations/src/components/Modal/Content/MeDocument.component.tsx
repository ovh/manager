import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
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
  const { data: url } = useNavigationGetUrl([
    config.rootLabel,
    `/upload/${operationID}`,
    {},
  ]);

  return (
    <OdsLink
      label={t(`domain_operations_update_nicowner_click_${argumentKey}`)}
      icon="external-link"
      className="mb-1 block modal-link"
      href={url as string}
      data-testid="documentModal"
      isDisabled={!url}
    />
  );
}
