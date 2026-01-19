import { useTranslation } from 'react-i18next';
import { Badge, Icon, ICON_NAME, BADGE_COLOR } from '@ovhcloud/ods-react';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';

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
    <div className="flex items-center gap-x-3">
      <Badge
        color={isRegistered ? BADGE_COLOR.success : BADGE_COLOR.neutral}
        className="capitalize"
      >
        {!isRegistered && <Icon name={ICON_NAME.hexagonExclamation} />}
        {t(`allDom_domain_table_registration_status_${registrationStatus}`)}
        {!isRegistered && (
          <CircleQuestionTooltip
            translatedMessage={t(
              'allDom_domain_table_status_domain_unregistered',
            )}
          />
        )}
      </Badge>
    </div>
  );
}
