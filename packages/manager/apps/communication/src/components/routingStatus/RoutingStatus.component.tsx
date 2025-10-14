import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

export default function RoutingStatusChip({ active }: { active: boolean }) {
  const { t } = useTranslation(NAMESPACES.STATUS);
  return (
    <OdsBadge
      color={active ? ODS_BADGE_COLOR.success : ODS_BADGE_COLOR.critical}
      label={t(active ? 'ok' : 'disabled')}
    />
  );
}
