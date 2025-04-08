import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
}

export default function DatagridColumnActionMenu({
  serviceId,
}: DatagridColumnActionMenuProps) {
  const { t } = useTranslation('allDom');
  const { data: url } = useNavigationGetUrl([
    'cgi-bin',
    `/order/renew.cgi?domainChooser=${serviceId}`,
    {},
  ]);
  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('allDom_table_action_renew'),
          href: url as string,
          target: '_blank',
        },
      ]}
    />
  );
}
