import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStateProps {
  readonly registrationStatus: DomainRegistrationStateEnum;
  readonly valueToVerify: string;
  readonly correspondingEnum: string;
}

export default function DomainDatagridColumnState({
  registrationStatus,
  valueToVerify,
  correspondingEnum,
}: DomainDatagridColumnStateProps) {
  const { t } = useTranslation('allDom');
  const isEnable = () => {
    return valueToVerify === correspondingEnum;
  };

  if (registrationStatus === DomainRegistrationStateEnum.Unregistered) {
    return '';
  }

  return (
    <DataGridTextCell>
      <OdsBadge
        color={isEnable ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.critical}
        label={
          isEnable
            ? t('allDom_domain_table_header_enable')
            : t('allDom_domain_table_header_disable')
        }
      />
    </DataGridTextCell>
  );
}
