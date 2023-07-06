import { h } from '@stencil/core';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
  OdsThemeTypographySize,
} from '@ovhcloud/ods-theming';
import {
  OdsIconName,
  OdsIconSize,
  OdsChipSize,
  OdsHTMLAnchorElementTarget,
  OdsChipVariant,
} from '@ovhcloud/ods-core';
import formatDate from '../../../../utils/date.utils';
import { getTranslation } from '../../../../utils/translation.utils';

export const CommitmentContent = (
  servicePath: string,
  commitmentStatus: string,
  localStrings: { [key: string]: string },
  language: string,
  nextBillingDate: string,
  requestDate: string,
  dataTracking?: string,
) => {
  const status = commitmentStatus;
  switch (status) {
    case 'ended':
      return (
        <osds-text
          class="tile-description"
          level={OdsThemeTypographyLevel.body}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.default}
        >
          {getTranslation(
            localStrings,
            'manager_billing_subscription_engagement_status_engaged_expired',
            {
              endDate: formatDate(nextBillingDate, language),
            },
          )}
        </osds-text>
      );
    case 'renews':
      return (
        <osds-text
          class="tile-description"
          level={OdsThemeTypographyLevel.body}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.default}
        >
          {getTranslation(
            localStrings,
            'manager_billing_subscription_engagement_status_engaged_renew',
            {
              endDate: formatDate(nextBillingDate, language),
            },
          )}
        </osds-text>
      );
    case 'requested':
      return (
        <osds-text
          class="tile-description"
          level={OdsThemeTypographyLevel.body}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.default}
        >
          {getTranslation(
            localStrings,
            'manager_billing_subscription_engagement_status_commitement_pending',
            {
              nextBillingDate: formatDate(requestDate, language),
            },
          )}
        </osds-text>
      );
    case 'ends':
      return (
        <div>
          <osds-chip
            color={OdsThemeColorIntent.error}
            size={OdsChipSize.sm}
            variant={OdsChipVariant.flat}
          >
            {getTranslation(
              localStrings,
              'manager_billing_subscription_engagement_status_engaged',
              {
                endDate: formatDate(nextBillingDate, language),
              },
            )}
          </osds-chip>
        </div>
      );
    default:
      return (
        <osds-text
          class="tile-description"
          level={OdsThemeTypographyLevel.body}
          size={OdsThemeTypographySize._200}
          color={OdsThemeColorIntent.default}
        >
          <osds-chip
            color={OdsThemeColorIntent.error}
            size={OdsChipSize.sm}
            variant={OdsChipVariant.flat}
          >
            {localStrings.manager_billing_subscription_engagement_status_none}
          </osds-chip>
          <div>
            <osds-link
              data-tracking={dataTracking}
              color={OdsThemeColorIntent.primary}
              href={`https://www.ovh.com/manager/dedicated/#/${servicePath}/dashboard/commitment`}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {localStrings.manager_billing_subscription_engagement_commit}
              <osds-icon
                class="link-icon"
                size={OdsIconSize.xxs}
                name={OdsIconName.ARROW_RIGHT}
                color={OdsThemeColorIntent.primary}
              />
            </osds-link>
          </div>
        </osds-text>
      );
  }
};

export default CommitmentContent;
