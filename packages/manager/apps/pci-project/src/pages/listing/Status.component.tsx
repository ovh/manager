import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TProjectWithService } from '@/data/models/Project.type';

type StatusComponentProps = {
  project: TProjectWithService;
};

export default function StatusComponent({ project }: Readonly<StatusComponentProps>) {
  const { t } = useTranslation(['listing', NAMESPACES.STATUS, NAMESPACES.SERVICE]);

  const isUnpaidAndNotSuspended = project.isUnpaid && project.status !== 'suspended';

  const badgeColor = useMemo<OdsBadgeColor>(() => {
    if (isUnpaidAndNotSuspended) {
      return 'critical';
    }

    switch (project.status) {
      case 'deleted':
      case 'suspended':
        return 'critical';
      case 'deleting':
        return 'warning';
      case 'ok':
        return 'success';
      default:
        return 'information';
    }
  }, [project, isUnpaidAndNotSuspended]);

  const getStatusLabel = () => {
    if (isUnpaidAndNotSuspended) {
      return t('pendingDebt', { ns: NAMESPACES.STATUS });
    }
    if (project.status === 'deleted') {
      return t('service_state_deleted', { ns: NAMESPACES.SERVICE });
    }
    return t(project.status, { ns: NAMESPACES.STATUS });
  };

  return <OdsBadge color={badgeColor} data-testid="status_badge" label={getStatusLabel()} />;
}
