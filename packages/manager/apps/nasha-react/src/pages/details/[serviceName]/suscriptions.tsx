import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  OsdsText,
  OsdsDivider,
  OsdsLink,
  OsdsIcon,
  OsdsChip,
  OsdsSpinner,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';

import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';
import { serviceInfos } from '@/api/nasha-react';

import EngagedUpToContent from './engagementUpToContent';
import DateLocale from './dateLocale';
import ButtonTooltip from './buttonTooltip';

function Subscriptions(props: any) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos', { serviceName }],
    serviceInfos,
  );

  const {
    domain,
    creation,
    expiration,
    engagedUpTo,
    renew,
    contactAdmin,
    contactTech,
    contactBilling,
  } = data || {};
  const { t } = useTranslation('nasha-react/details/dashboard');

  if (isLoading) return <OsdsSpinner />;
  if (isError) return <span>{t('manager_billing_subscription_error')}</span>;

  return (
    <>
      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            {t('manager_billing_subscription_creation')}
          </OsdsText>
        </div>
        <OsdsText>
          <DateLocale date={creation} />
        </OsdsText>
      </div>
      <OsdsDivider separator />
      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            {t('manager_billing_subscription_next_due_date')}
          </OsdsText>
        </div>
        <div className="buttonTooltipDashboard">
          <div className="elementTileLeft">
            <OsdsText>
              <DateLocale date={expiration} />
            </OsdsText>
          </div>
          <div className="elementTileRight">
            <ButtonTooltip
              tooltipContent={[
                {
                  label: (
                    <OsdsLink color={OdsThemeColorIntent.primary}>
                      {t(
                        'manager_billing_subscription_engagement_menu_actions_renewal',
                      )}
                    </OsdsLink>
                  ),
                },
                {
                  label: (
                    <OsdsLink color={OdsThemeColorIntent.primary}>
                      {t(
                        'manager_billing_subscription_engagement_menu_actions_commitment',
                      )}
                    </OsdsLink>
                  ),
                },
                {
                  label: (
                    <OsdsLink color={OdsThemeColorIntent.primary}>
                      {t(
                        'manager_billing_subscription_engagement_menu_actions_resiliate',
                      )}
                    </OsdsLink>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div>
        {renew.manualPayment && (
          <div>
            <OsdsChip color={OdsThemeColorIntent.warning}>
              {t('nasha_dashboard_suscriptions_manual_renew')}
            </OsdsChip>

            <OsdsDivider separator={true} color={OdsThemeColorIntent.default} />
          </div>
        )}
        {!renew.manualPayment && renew.automatic && (
          <div>
            <OsdsChip color={OdsThemeColorIntent.success}>
              {t('nasha_dashboard_suscriptions_automatic_renewal')}
            </OsdsChip>
            <OsdsDivider separator={true} color={OdsThemeColorIntent.default} />
          </div>
        )}
      </div>

      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            {t('manager_billing_subscription_engagement')}
          </OsdsText>
        </div>
        <EngagedUpToContent dateEngagementUpTo={engagedUpTo} t={t} />{' '}
      </div>
      <div>
        <div>
          <OsdsText
            level={OdsThemeTypographyLevel.subheading}
            color={OdsThemeColorIntent.text}
          >
            {t('manager_billing_subscription_contacts')}:
          </OsdsText>
        </div>
        <OsdsText>
          <div>
            {contactAdmin} {t('manager_billing_subscription_contacts_admin')}
          </div>
          <div>
            {contactTech} {t('manager_billing_subscription_contacts_tech')}
          </div>
          <div>
            {contactBilling}{' '}
            {t('manager_billing_subscription_contacts_billing')}
          </div>
        </OsdsText>
        <OsdsLink color={OdsThemeColorIntent.primary}>
          {t('manager_billing_subscription_contacts_management')}
          <span slot="end">
            <OsdsIcon
              name={OdsIconName.ARROW_RIGHT}
              size={OdsIconSize.xs}
              color={OdsThemeColorIntent.primary}
            />
          </span>
        </OsdsLink>
      </div>
    </>
  );
}

export default Subscriptions;
