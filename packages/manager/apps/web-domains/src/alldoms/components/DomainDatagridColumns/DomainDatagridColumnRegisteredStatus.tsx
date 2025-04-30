import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStatusProps {
  readonly registrationStatus: DomainRegistrationStateEnum;
}

export default function DomainDatagridColumnRegisteredStatus({
  registrationStatus,
}: DomainDatagridColumnStatusProps) {
  return (
    <OdsBadge
      color={
        registrationStatus === DomainRegistrationStateEnum.Registered
          ? ODS_BADGE_COLOR.success
          : ODS_BADGE_COLOR.neutral
      }
      label={registrationStatus.toLowerCase()}
      className="capitalize"
      icon={
        registrationStatus === DomainRegistrationStateEnum.Registered
          ? null
          : ODS_ICON_NAME.hexagonExclamation
      }
    />
  );
}
