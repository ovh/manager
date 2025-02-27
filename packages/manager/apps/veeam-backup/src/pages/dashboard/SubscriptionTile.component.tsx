import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsBadge,
  OdsButton,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  DashboardTile,
  useServiceDetails,
  useFormattedDate,
  DateFormat,
} from '@ovh-ux/manager-react-components';
import { VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import { LoadingChip } from '@/components/Loading/Loading';
import TEST_IDS from '@/utils/testIds.constants';

export const SubscriptionTile: React.FC<VeeamBackup> = ({
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
              <OdsSkeleton />
              <LoadingChip className="mt-5" />
            </>
          ) : (
            <>
              <OdsText className="block">{nextBillingDate}</OdsText>
              {data?.data?.billing?.renew?.current?.mode && (
                <OdsBadge
                  className="mt-1"
                  color="success"
                  label={t(`${data.data.billing.renew.current.mode}_renew`)}
                />
              )}
            </>
          ),
        },
        {
          id: 'creationDate',
          label: t('creation_date'),
          value: <OdsText>{creationDate}</OdsText>,
        },
        {
          id: 'deleteService',
          value: (
            // IAM not implemented yet on services
            <OdsButton
              label={t('delete_service')}
              variant="ghost"
              isDisabled={resourceStatus !== 'READY'}
              iconAlignment="right"
              onClick={() =>
                navigate(urls.deleteVeeamFromDashboard.replace(':id', id))
              }
              icon="chevron-right"
              data-testid={TEST_IDS.deleteServiceCta}
            />
          ),
        },
        {
          id: 'contacts',
          label: t('contacts'),
          value: (
            <div className="flex flex-col">
              {isLoading ? (
                <>
                  <OdsSkeleton />
                  <OdsSkeleton />
                  <OdsSkeleton />
                </>
              ) : (
                data?.data?.customer?.contacts?.map((contact) => (
                  <OdsText key={contact.type}>
                    {t(`${contact.type}_contact`, {
                      code: contact.customerCode,
                    })}
                  </OdsText>
                ))
              )}
            </div>
          ),
        },
      ]}
    />
  );
};
