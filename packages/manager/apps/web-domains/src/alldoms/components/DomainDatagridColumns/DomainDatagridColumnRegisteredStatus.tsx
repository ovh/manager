import React from 'react';
import {
  OdsBadge,
  OdsIcon,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnStatusProps {
  readonly registrationStatus: DomainRegistrationStateEnum;
  readonly domainName: string;
}

export default function DomainDatagridColumnRegisteredStatus({
  registrationStatus,
  domainName,
}: DomainDatagridColumnStatusProps) {
  const { t } = useTranslation('allDom');
  const isRegistered =
    registrationStatus === DomainRegistrationStateEnum.Registered;

  return (
    <div className="flex items-center gap-x-3">
      <OdsBadge
        color={isRegistered ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.neutral}
        label={t(
          `allDom_domain_table_registration_status_${registrationStatus}`,
        )}
        className="capitalize"
        icon={isRegistered ? null : ODS_ICON_NAME.hexagonExclamation}
      />
      {!isRegistered && (
        <div>
          <OdsIcon id={domainName} name={ODS_ICON_NAME.circleQuestion} />
          <OdsTooltip role="tooltip" strategy="fixed" triggerId={domainName}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('allDom_domain_table_status_domain_unregistered')}
            </OdsText>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
