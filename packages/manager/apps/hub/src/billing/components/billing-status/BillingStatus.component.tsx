import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { BADGE_INTENT_BY_STATUS } from '@/billing/components/billing-status/BillingStatus.constants';
import { BillingService } from '@/billing/types/billingServices.type';

type BillingStatusProps = {
  service: BillingService;
};

export default function BillingStatus({ service }: BillingStatusProps) {
  const { t } = useTranslation('billing/status');
  const shouldHideAutorenewStatus =
    service.isOneShot() || ['SMS'].includes(service.serviceType);
  return (
    <p>
      {service.hasDebt() && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          inline
        >
          {t('manager_billing_service_status_pending_debt')}
        </OsdsChip>
      )}
      {shouldHideAutorenewStatus && !service.isResiliated() && <span>-</span>}
      {shouldHideAutorenewStatus && service.isResiliated() && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          inline
        >
          {t('manager_billing_service_status_expired')}
        </OsdsChip>
      )}
      {!service.hasDebt() && !shouldHideAutorenewStatus && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={
            ODS_THEME_COLOR_INTENT[BADGE_INTENT_BY_STATUS[service.getRenew()]]
          }
          inline
        >
          {t(`manager_billing_service_status_${service.getRenew()}`)}
        </OsdsChip>
      )}
    </p>
  );
}
