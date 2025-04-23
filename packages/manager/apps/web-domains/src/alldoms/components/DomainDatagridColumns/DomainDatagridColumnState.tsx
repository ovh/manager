import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import React from 'react';
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
  const isEnabled = valueToVerify === correspondingEnum;

  return (
    <div className="inline-block" aria-hidden={true}>
      <OdsBadge
        color={isEnabled ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.critical}
        label={
          isEnabled
            ? t(`allDom_domain_table_status_enable_${gender}`)
            : t(`allDom_domain_table_status_disable_${gender}`)
        }
      />
    </div>
  );
}
