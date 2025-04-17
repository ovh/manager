import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import { useUpdateAllDomService } from '@/alldoms/hooks/data/query';

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
  const { renew, domain: serviceName } = serviceInfoDetail.serviceInfo;
  const { automatic } = serviceInfoDetail.serviceInfo.renew;
  const updateAllDomServiceMutation = useUpdateAllDomService();

  return (
    <ActionMenu
      id={serviceId}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      items={[
        {
          id: 2,
          label: t('allDom_table_action_terminate'),
          onClick: () => openModal(serviceInfoDetail),
        },
        {
          id: 3,
          label: automatic
            ? t('allDom_table_action_disable_automatic_renewal')
            : t('allDom_table_action_enable_automatic_renewal'),
          onClick: async () => {
            await updateAllDomServiceMutation.mutateAsync({
              serviceName,
              renewPayload: {
                ...renew,
                automatic: !automatic,
                deleteAtExpiration: !!automatic,
              },
            });
          },
        },
      ]}
    />
  );
}
