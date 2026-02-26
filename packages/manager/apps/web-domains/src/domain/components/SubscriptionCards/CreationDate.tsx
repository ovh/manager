import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';
import { TDomainResource } from '@/domain/types/domainResource';

interface CreationDateProps {
  readonly domainResources: TDomainResource;
}

export default function CreationDate({ domainResources }: CreationDateProps) {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
  ]);

  const formatDate = useFormatDate();

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t(`${NAMESPACES.DASHBOARD}:creation_date`)}
      </ManagerTile.Item.Label>
      <div className="flex items-center justify-between">
        <Text>
          {formatDate({ date: domainResources.currentState.createdAt })}
        </Text>
      </div>
    </ManagerTile.Item>
  );
}
