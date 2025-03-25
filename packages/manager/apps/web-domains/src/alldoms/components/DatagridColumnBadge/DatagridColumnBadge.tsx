/* eslint-disable prettier/prettier */
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ServiceInfoRenewEnum } from '@/alldoms/enum/service.enum';
import { TServiceDetail } from '@/alldoms/types';

interface DatagridColumnBadgeProps {
  readonly props: TServiceDetail;
}

export default function DatagridColumnBadge({
  props,
}: DatagridColumnBadgeProps) {
  const { t } = useTranslation('allDom');
  const { renewalType } = props.serviceInfo;
  const badgeColor = (status: string) => {
    switch (status) {
      case ServiceInfoRenewEnum.AutomaticForce:
        return ODS_BADGE_COLOR.success;
      case ServiceInfoRenewEnum.Automatic2012:
        return ODS_BADGE_COLOR.success;
      case ServiceInfoRenewEnum.Automatic2016:
        return ODS_BADGE_COLOR.success;
      default:
        return ODS_BADGE_COLOR.warning;
    }
  };

  return (
    <OdsBadge
      label={t(`allDom_table_status_${renewalType}`)}
      color={badgeColor(renewalType)}
    />
  );
}
