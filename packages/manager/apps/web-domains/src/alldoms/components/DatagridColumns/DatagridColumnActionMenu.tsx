import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';

interface DatagridColumnActionMenuProps {
  readonly serviceId: string;
  readonly serviceInfoDetail: TServiceDetail;
  readonly openModal: (serviceInfoDetail: TServiceDetail) => void;
}

export default function DatagridColumnActionMenu({
  serviceId,
  serviceInfoDetail,
  openModal,
}: DatagridColumnActionMenuProps) {
  const { t } = useTranslation('allDom');
  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 1,
          label: t('allDom_table_action_renew'),
          href: `https://www.ovh.com/cgi-bin/order/renew.cgi?domainChooser=${serviceId}`,
          target: '_blank',
          'data-testid': 'renew-button',
        },
        {
          id: 2,
          label: t('allDom_table_action_terminate'),
          onClick: () => openModal(serviceInfoDetail),
        },
      ]}
    />
  );
}
