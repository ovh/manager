import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { WebsiteType } from '@/api/type';
import { useHostingUrl } from '@/hooks';

interface ActionButtonStatisticsProps {
  webSiteItem: WebsiteType;
}

const ActionButtonStatistics: React.FC<ActionButtonStatisticsProps> = ({
  webSiteItem,
}) => {
  const { t } = useTranslation('common');
  const urlPromise = useHostingUrl(
    webSiteItem?.currentState.hosting.serviceName,
    'user-logs',
  );
  const handleStatisticsVisitClick = () => {
    window.open(urlPromise, '_blank');
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleStatisticsVisitClick,
      label: t('web_hosting_dashboard_action_statistics'),
    },
  ];

  return (
    <ActionMenu
      id={webSiteItem.id}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonStatistics;
