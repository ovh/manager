import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsSkeleton, OsdsText } from '@ovhcloud/ods-components/react';

import { useHubContext } from '@/pages/dashboard/context';

export default function HubDashboardSubtitle() {
  const { isLoading, isFreshCustomer } = useHubContext();
  const { t } = useTranslation();

  return (
    <div className="inline-block my-6 h-[32px]">
      {isLoading ? (
        <OsdsSkeleton size={ODS_SKELETON_SIZE.md} inline className="p-4"></OsdsSkeleton>
      ) : (
        !isFreshCustomer && (
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._500}
            hue={ODS_TEXT_COLOR_HUE._800}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('manager_hub_dashboard_overview')}
          </OsdsText>
        )
      )}
    </div>
  );
}
