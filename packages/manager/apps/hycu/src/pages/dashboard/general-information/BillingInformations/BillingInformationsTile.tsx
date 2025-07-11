import {
  DashboardTile,
  DateFormat,
  Description,
  useFormattedDate,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigationGetUrl } from '@/hooks/shell/useNavigationGetUrl';
import { subRoutes, urls } from '@/routes/routes.constant';
import { ManagerLink } from '@/components/ManagerLink/ManagerLink.component';
import { TRACKING } from '@/tracking.constant';

const BillingInformationsTile = ({ serviceName }: { serviceName: string }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation([
    'hycu/dashboard',
    NAMESPACES.BILLING,
    NAMESPACES.CONTACT,
    NAMESPACES.DASHBOARD,
  ]);
  const navigate = useNavigate();

  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });

  const renewDate = useFormattedDate({
    dateString: serviceDetails?.data.billing.nextBillingDate,
    format: DateFormat.display,
  });

  const creationDate = useFormattedDate({
    dateString: serviceDetails?.data.billing.lifecycle.current.creationDate,
    format: DateFormat.display,
  });

  const { data: renewUrl, isLoading: isRenewUrlLoading } = useNavigationGetUrl([
    'dedicated',
    '#/billing/autorenew',
    { searchText: serviceName },
  ]);

  const openTerminateModal = () =>
    navigate(
      urls.dashboard_terminate.replace(subRoutes.serviceName, serviceName),
    );

  return (
    <DashboardTile
      title={t(`${NAMESPACES.BILLING}:subscription`)}
      items={[
        {
          id: 'renew',
          label: t(`${NAMESPACES.BILLING}:automatic_renew`),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <OsdsLink
              href={(renewUrl as string) ?? '#'}
              className={isRenewUrlLoading ? 'cursor-wait' : ''}
              color={ODS_THEME_COLOR_INTENT.info}
              onClick={() => {
                trackClick(
                  TRACKING.dashboard.autorenewClick(
                    serviceDetails?.data.billing.plan.code,
                  ),
                );
              }}
            >
              {renewDate}
            </OsdsLink>
          ),
        },
        {
          id: 'date_creation',
          label: t(`${NAMESPACES.DASHBOARD}:creation_date`),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <Description>{creationDate}</Description>
          ),
        },
        {
          id: 'link_terminated',
          value: (
            <ManagerLink
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                trackClick(
                  TRACKING.dashboard.resiliateClick(
                    serviceDetails?.data.billing.plan.code,
                  ),
                );
                openTerminateModal();
              }}
              disabled={serviceDetails?.data.resource.state === 'suspended'}
            >
              <div className="flex items-center">
                <div>{t('hycu_dashboard_link_terminate')}</div>
                <OsdsIcon
                  name={ODS_ICON_NAME.CHEVRON_RIGHT}
                  color={ODS_THEME_COLOR_INTENT.primary}
                ></OsdsIcon>
              </div>
            </ManagerLink>
          ),
        },
        {
          id: 'contact',
          label: t(`${NAMESPACES.CONTACT}:contacts`),
          value: (
            <div className="flex flex-col gap-4">
              <div>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <OsdsSkeleton key={index} />
                    ))
                  : serviceDetails?.data.customer.contacts.map((contact) => (
                      <Description key={contact.type}>{`${
                        contact.customerCode
                      } ${t(
                        `${NAMESPACES.CONTACT}:${contact.type}`,
                      )}`}</Description>
                    ))}
              </div>
            </div>
          ),
        },
      ]}
    ></DashboardTile>
  );
};

export default BillingInformationsTile;
