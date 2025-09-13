import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab, OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

export type KmsTabProps = {
  url: string;
  content: React.ReactElement;
  disabled?: boolean;
};

export type KmsTabsProps = {
  tabs: KmsTabProps[];
};

/**
 * Get the index of the active tab based on the current path.
 */
function getActiveTabIndex(tabs: KmsTabProps[], currentPath: string): number {
  // Find the tab with the longest matching URL prefix
  let bestMatchIndex = -1;
  let bestMatchLength = 0;

  tabs.forEach((tab, index) => {
    if (currentPath.startsWith(tab.url) && tab.url.length > bestMatchLength) {
      bestMatchIndex = index;
      bestMatchLength = tab.url.length;
    }
  });

  return bestMatchIndex;
}

const KmsTabs: React.FC<KmsTabsProps> = ({ tabs }) => {
  const { trackClick } = useOvhTracking();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/dashboard');

  const activeTabIndex = getActiveTabIndex(tabs, location.pathname);

  return (
    <OdsTabs
      onOdsTabsSelected={(event) => {
        const { id: url } = event.detail.target as HTMLElement;

        const trackingTag = url.split('/').pop()?.length
          ? url.split('/').pop()
          : 'general-informations';

        if (trackingTag) {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: [trackingTag],
          });
        }
        navigate(url);
      }}
    >
      {tabs.map((tab: KmsTabProps, index) => (
        <OdsTab
          key={`ods-tab-bar-item-${tab.url}`}
          id={tab.url}
          isSelected={index === activeTabIndex}
          isDisabled={tab.disabled}
          className="flex items-center justify-center"
        >
          {tab.content}
          {tab.disabled && (
            <OdsBadge
              size={ODS_BADGE_SIZE.sm}
              className="ml-2"
              label={t('key_management_service_dashboard_tab_comming_soon')}
            />
          )}
        </OdsTab>
      ))}
    </OdsTabs>
  );
};

export default KmsTabs;
