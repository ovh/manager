import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';

interface MeContactComponentProps {
  readonly argumentKey: string;
  readonly value: string;
  readonly fields: string[];
}

export default function MeContactComponent({
  argumentKey,
  value,
  fields,
}: MeContactComponentProps) {
  const { t } = useTranslation('dashboard');

  return (
    <OdsLink
      href={`/manager/#/dedicated/contact/${value}/?fields[]=${fields}`}
      color="primary"
      label={t(`domain_operations_update_nicowner_click_${argumentKey}`)}
      className="block"
      target="_blank"
      icon="external-link"
      data-testid="contactModal"
    />
  );
}
