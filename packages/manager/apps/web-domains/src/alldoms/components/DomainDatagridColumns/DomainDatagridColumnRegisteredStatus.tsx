import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStatusProps {
  readonly registrationStatus: DomainRegistrationStateEnum;
}

export default function DomainDatagridColumnRegisteredStatus({
  registrationStatus,
}: DomainDatagridColumnStatusProps) {
  const { t } = useTranslation('allDom');
  const isRegistered =
    registrationStatus === DomainRegistrationStateEnum.Registered;

  return (
    <OdsBadge
      color={isRegistered ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.neutral}
      label={
        isRegistered
          ? t('allDom_domain_table_registration_status_registered')
          : t('allDom_domain_table_registration_status_unregistered')
      }
      className="capitalize"
      icon={isRegistered ? null : ODS_ICON_NAME.hexagonExclamation}
    />
  );
}
