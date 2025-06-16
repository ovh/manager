import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { DomainEnum } from '@/alldoms/enum/domain';

interface DatagridOngoingOperationStateProps {
  status: DomainEnum;
}

export default function DatagridOngoingOperationState({
  status,
}: DatagridOngoingOperationStateProps) {
  const badgeColor = () => {
    switch (status) {
      case DomainEnum.Todo:
        return ODS_BADGE_COLOR.information;
      case DomainEnum.Doing:
        return ODS_BADGE_COLOR.information;
      case DomainEnum.Problem:
        return ODS_BADGE_COLOR.critical;
      case DomainEnum.Error:
        return ODS_BADGE_COLOR.warning;
      case DomainEnum.Done:
        return ODS_BADGE_COLOR.success;
      case DomainEnum.Cancelled:
        return ODS_BADGE_COLOR.neutral;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };

  return (
    <DataGridTextCell>
      <OdsBadge color={badgeColor()} label={status} />
    </DataGridTextCell>
  );
}
