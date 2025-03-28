import React, { Suspense, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

const TabsDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('dashboard');

  const isDashboard =
    location.pathname === `/pci/projects/${projectId}/savings-plan`;
  const isListing =
    location.pathname === `/pci/projects/${projectId}/savings-plan/listing`;

  const handleNavigationClick = useCallback(() => {
    navigate(`/pci/projects/${projectId}/savings-plan`);
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['dashboard'],
    });
  }, [navigate, projectId, trackClick]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OdsTabs className="my-tabs mb-4" id="css-tabs">
        <OdsTab
          className="my-tab"
          id="css-tab-1"
          isSelected={isDashboard}
          onClick={handleNavigationClick}
        >
          {t('dashboard_tabs')}
        </OdsTab>
        <OdsTab
          id="css-tab-2"
          isSelected={isListing}
          onClick={() =>
            navigate(`/pci/projects/${projectId}/savings-plan/listing`)
          }
        >
          {t('listing_tabs')}
        </OdsTab>
      </OdsTabs>
    </Suspense>
  );
};

export default TabsDashboard;
