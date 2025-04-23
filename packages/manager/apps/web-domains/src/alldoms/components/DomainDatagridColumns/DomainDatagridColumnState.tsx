import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Gender } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStateProps {
  readonly valueToVerify: string | boolean;
  readonly correspondingEnum: string | boolean;
  readonly gender?: Gender;
}

export default function DomainDatagridColumnState({
  valueToVerify,
  correspondingEnum,
  gender = Gender.Fem,
}: DomainDatagridColumnStateProps) {
  const { t } = useTranslation('allDom');
  const isEnable = useMemo(() => {
    if (valueToVerify === correspondingEnum) {
      return true;
    }
    return false;
  }, [valueToVerify, correspondingEnum]);

  return (
    <DataGridTextCell>
      <OdsBadge
        color={isEnable ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.critical}
        label={
          isEnable
            ? t(`allDom_domain_table_status_enable_${gender}`)
            : t(`allDom_domain_table_status_disable_${gender}`)
        }
      />
    </DataGridTextCell>
  );
}
