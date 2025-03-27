import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

const KmsTabs: React.FC<KmsTabsProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const { trackClick } = useOvhTracking();
  const location = useLocation();
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/dashboard');

  useEffect(() => {
    const activeTab = tabs.find(
      (tab) =>
        tab.url !== '' && location.pathname.startsWith(`/${okmsId}/${tab.url}`),
    );
    setActivePanel(activeTab?.url || '');
  }, [location]);

  return (
    <div className="mb-6">
      <OdsTabs
        onOdsTabsSelected={(event) => {
          const { id } = event.detail.target as HTMLElement;
          const url = `/${okmsId}/${id}`;

          const trackingTag = id ?? 'general-informations';

          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.tab,
            actionType: 'navigation',
            actions: [trackingTag],
          });

          setActivePanel(id);
          navigate(url);
        }}
      >
        {tabs.map((tab: KmsTabProps) => (
          <OdsTab
            key={`ods-tab-bar-item-${tab.url}`}
            id={tab.url}
            isSelected={activePanel === tab.url}
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
    </div>
  );
};

export default KmsTabs;
