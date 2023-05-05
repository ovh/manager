import React from 'react';

import {
  OsdsChip,
  OsdsDivider,
  OsdsText,
  OsdsLink,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react/';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';

import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import DateLocale from './dateLocale';

interface EngagedUpToContentProps {
  dateEngagementUpTo: Date | null;
  t: (key: string) => string;
}

const EngagedUpToContent: React.FC<EngagedUpToContentProps> = ({
  dateEngagementUpTo,
  t,
}) => {
  if (!dateEngagementUpTo) {
    return (
      <div>
        <div>
          <OsdsChip color={OdsThemeColorIntent.error}>
            {t('manager_billing_subscription_engagement_status_none')}
          </OsdsChip>
        </div>

        <OsdsLink color={OdsThemeColorIntent.primary}>
          {t('manager_billing_subscription_engagement_commit')}
          <span slot="end">
            <OsdsIcon
              name={OdsIconName.ARROW_RIGHT}
              size={OdsIconSize.xs}
              color={OdsThemeColorIntent.primary}
            />
          </span>
        </OsdsLink>
        <OsdsDivider separator />
      </div>
    );
  }

  return (
    <div>
      <OsdsText>
        {t('manager_billing_subscription_engagement_status_engaged')}{' '}
        <DateLocale date={dateEngagementUpTo} />{' '}
      </OsdsText>
      <OsdsDivider separator />
    </div>
  );
};

export default EngagedUpToContent;
