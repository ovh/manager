import {
  DashboardTile,
  DateFormat,
  Description,
  Renew,
  useFormattedDate,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@/hooks/shell/useNavigationGetUrl';

const BillingInformationsTile = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation('hycu/dashboard');

  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });

  const renewDate = useFormattedDate({
    dateString: (serviceDetails?.data.billing.renew as Renew)?.current.nextDate,
    format: DateFormat.display,
  });

  const creationDate = useFormattedDate({
    dateString: serviceDetails?.data.billing.lifecycle.current.creationDate,
    format: DateFormat.display,
  });

  const {
    data: contactUrl,
    isLoading: isContactUrlLoading,
  } = useNavigationGetUrl([
    'dedicated',
    '#/contacts/services',
    { serviceName },
  ]);

  return (
    <DashboardTile
      title={t('hycu_dashboard_subscription_title')}
      items={[
        {
          id: 'renew',
          label: t('hycu_dashboard_label_renew'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <OsdsLink color={ODS_THEME_COLOR_INTENT.info}>{renewDate}</OsdsLink>
          ),
        },
        {
          id: 'contact',
          label: t('hycu_dashboard_field_label_contacts'),
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
                        `hycu_dashboard_contact_type_${contact.type}`,
                      )}`}</Description>
                    ))}
              </div>

              <div className="flex flex-row items-center">
                <OsdsLink
                  href={(contactUrl as string) ?? '#'}
                  className={isContactUrlLoading ? 'cursor-wait' : ''}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  {t('hycu_dashboard_field_label_manage_contacts')}
                  <span slot="end">
                    <OsdsIcon
                      className="ml-3"
                      name={ODS_ICON_NAME.ARROW_RIGHT}
                      size={ODS_ICON_SIZE.xs}
                      color={ODS_THEME_COLOR_INTENT.info}
                    ></OsdsIcon>
                  </span>
                </OsdsLink>
              </div>
            </div>
          ),
        },
        {
          id: 'date_creation',
          label: t('hycu_dashboard_field_label_date_creation'),
          value: isLoading ? (
            <OsdsSkeleton />
          ) : (
            <Description>{creationDate}</Description>
          ),
        },
        {
          id: 'link_terminated',
          value: (
            <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
              {t('hycu_dashboard_link_terminated')}
              <span slot="end">
                <OsdsIcon
                  className="ml-3"
                  size={ODS_ICON_SIZE.xs}
                  name={ODS_ICON_NAME.CHEVRON_RIGHT}
                  color={ODS_THEME_COLOR_INTENT.primary}
                ></OsdsIcon>
              </span>
            </OsdsLink>
          ),
        },
      ]}
    ></DashboardTile>
  );
};

export default BillingInformationsTile;
