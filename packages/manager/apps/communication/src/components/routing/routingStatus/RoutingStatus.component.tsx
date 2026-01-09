import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

type RoutingStatusChipProps = {
  active: boolean;
};

export default function RoutingStatusChip({ active }: RoutingStatusChipProps) {
  const { t } = useTranslation(NAMESPACES.STATUS);
  return (
    <Badge
      color={active ? BADGE_COLOR.success : BADGE_COLOR.critical}
    >
      {t(active ? 'ok' : 'disabled')}
    </Badge>
  );
}
