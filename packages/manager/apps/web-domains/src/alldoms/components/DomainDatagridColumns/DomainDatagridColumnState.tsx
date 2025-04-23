import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStateProps {
  readonly registrationStatus: DomainRegistrationStateEnum;
  readonly valueToVerify: string | boolean;
  readonly correspondingEnum: string | boolean;
}

export default function DomainDatagridColumnState({
  registrationStatus,
  valueToVerify,
  correspondingEnum,
}: DomainDatagridColumnStateProps) {
  const { t } = useTranslation('allDom');
  const isEnable = useMemo(() => {
    if (valueToVerify === correspondingEnum) {
      return true;
    }
    return false;
  }, [valueToVerify, correspondingEnum]);
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
