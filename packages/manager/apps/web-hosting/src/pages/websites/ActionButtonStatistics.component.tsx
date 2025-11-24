import React from 'react';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu } from '@ovh-ux/muk';

import { WebsiteType } from '@/data/types/product/website';
import { useHostingUrl } from '@/hooks';
import { STATISTICS, WEBSITE } from '@/utils/tracking.constants';

interface ActionButtonStatisticsProps {
  webSiteItem: WebsiteType;
}

const ActionButtonStatistics: React.FC<ActionButtonStatisticsProps> = ({ webSiteItem }) => {
  const { t } = useTranslation('common');
  const { trackClick } = useOvhTracking();
  const urlPromise = useHostingUrl(webSiteItem?.currentState.hosting.serviceName, 'user-logs');
  const handleStatisticsVisitClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [`${STATISTICS}_${WEBSITE}`],
    });
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
    <ActionMenu id={webSiteItem.id} items={actionItems} variant={BUTTON_VARIANT.ghost} isCompact />
  );
};

export default ActionButtonStatistics;
