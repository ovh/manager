import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsChip,
  OsdsIcon,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import {
  DashboardTile,
  Description,
  useServiceDetails,
  useFormattedDate,
  DateFormat,
} from '@ovh-ux/manager-react-components';
import { VeeamBackupWithIam } from '@/data';
import { urls } from '@/routes/routes.constant';
import { LoadingChip } from '@/components/Loading/Loading';

export const SubscriptionTile: React.FC<VeeamBackupWithIam> = ({
  id,
  createdAt,
  resourceStatus,
}) => {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useServiceDetails({ resourceName: id });
  const navigate = useNavigate();
  const creationDate = useFormattedDate({
    dateString: createdAt,
    format: DateFormat.fullDisplay,
  });
  const nextBillingDate = useFormattedDate({
    dateString: data?.data?.billing?.nextBillingDate,
    format: DateFormat.fullDisplay,
  });

  return (
    <DashboardTile
      title={t('subscription')}
      items={[
        {
          id: 'nextBilling',
          label: t('next_billing'),
          value: isLoading ? (
            <>
              <OsdsSkeleton />
              <LoadingChip className="mt-5" />
            </>
          ) : (
            <>
              <Description className="block">{nextBillingDate}</Description>
              {data?.data?.renew?.current?.mode && (
                <OsdsChip
                  className="mt-5"
                  inline
                  color={ODS_THEME_COLOR_INTENT.success}
                  size={ODS_CHIP_SIZE.sm}
                >
                  {t(`${data.data.renew.current.mode}_renew`)}
                </OsdsChip>
              )}
            </>
          ),
        },
        {
          id: 'creationDate',
          label: t('creation_date'),
          value: <Description>{creationDate}</Description>,
        },
        {
          id: 'deleteService',
          value: (
            // IAM not implemented yet on services
            <OsdsButton
              className="-ml-5 -mr-5"
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              textAlign={ODS_BUTTON_TEXT_ALIGN.start}
              disabled={resourceStatus !== 'READY' || undefined}
              onClick={() =>
                navigate(urls.deleteVeeamFromDashboard.replace(':id', id))
              }
            >
              {t('delete_service')}
              <OsdsIcon
                className="ml-4"
                name={ODS_ICON_NAME.CHEVRON_RIGHT}
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_ICON_SIZE.xs}
              />
            </OsdsButton>
          ),
        },
        {
          id: 'contacts',
          label: t('contacts'),
          value: (
            <div className="flex flex-col">
              {isLoading ? (
                <>
                  <OsdsSkeleton />
                  <OsdsSkeleton />
                  <OsdsSkeleton />
                </>
              ) : (
                data?.data?.customer?.contacts?.map((contact) => (
                  <Description key={contact.type}>
                    {t(`${contact.type}_contact`, {
                      code: contact.customerCode,
                    })}
                  </Description>
                ))
              )}
            </div>
          ),
        },
      ]}
    />
  );
};
