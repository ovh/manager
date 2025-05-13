import { useTranslation } from 'react-i18next';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { BADGE_INTENT_BY_STATUS } from '@/billing/components/billing-status/BillingStatus.constants';
import { BillingService } from '@/billing/types/billingServices.type';

type BillingStatusProps = {
  service: BillingService;
};

export default function BillingStatus({ service }: BillingStatusProps) {
  const { t } = useTranslation('billing/status');
  const shouldHideAutoRenewStatus =
    service.isOneShot() || ['SMS'].includes(service.serviceType);
  return (
    <div className="mb-5" data-testid="billing_status">
      {service.hasDebt() && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          inline
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          >
            {t('manager_billing_service_status_pending_debt')}
          </OsdsText>
        </OsdsChip>
      )}
      {shouldHideAutoRenewStatus && !service.isResiliated() && <span>-</span>}
      {shouldHideAutoRenewStatus && service.isResiliated() && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          inline
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          >
            {t('manager_billing_service_status_expired')}
          </OsdsText>
        </OsdsChip>
      )}
      {!service.hasDebt() && !shouldHideAutoRenewStatus && (
        <OsdsChip
          size={ODS_CHIP_SIZE.sm}
          color={
            ODS_THEME_COLOR_INTENT[BADGE_INTENT_BY_STATUS[service.getRenew()]]
          }
          inline
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._200}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          >
            {t(`manager_billing_service_status_${service.getRenew()}`)}
          </OsdsText>
        </OsdsChip>
      )}
    </div>
  );
}
