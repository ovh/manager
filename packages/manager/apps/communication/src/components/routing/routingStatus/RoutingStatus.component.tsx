import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type RoutingStatusChipProps = {
  active: boolean;
};

export default function RoutingStatusChip({ active }: RoutingStatusChipProps) {
  const { t } = useTranslation(NAMESPACES.STATUS);
  return (
    <OdsBadge
      color={active ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.critical}
      label={t(active ? 'ok' : 'disabled')}
    />
  );
}
