import { useContext, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { PageType, ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useHubContext } from '@/pages/dashboard/context';
import { INVOICE_DELAY_BANNER_FEATURE } from '@/pages/dashboard/dashboard.constants';
import { isWithinInvoiceDelayPeriod } from '@/pages/dashboard/invoiceDelayBanner.helpers';

export default function InvoiceDelayBanner() {
  const { t } = useTranslation('hub/invoice-delay');
  const {
    environment: { user },
  } = useContext(ShellContext);
  const { availability } = useHubContext();
  const { trackPage } = useOvhTracking();

  // The electronic invoicing platform the wording refers to is the French one:
  // the delay only concerns customers of the FR subsidiary, wherever in the
  // French regions they live.
  const shouldBeDisplayed = useMemo(
    () =>
      Boolean(availability?.[INVOICE_DELAY_BANNER_FEATURE]) &&
      user.ovhSubsidiary === 'FR' &&
      isWithinInvoiceDelayPeriod(),
    [availability, user],
  );

  useEffect(() => {
    if (shouldBeDisplayed) {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: 'invoice-delay',
      });
    }
  }, [shouldBeDisplayed]);

  return shouldBeDisplayed ? (
    <OsdsMessage
      className="mb-4 flex rounded"
      type={ODS_MESSAGE_TYPE.info}
      color={ODS_THEME_COLOR_INTENT.info}
      removable={true}
      data-testid="invoice_delay_banner"
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <p className="m-0">{t('manager_hub_dashboard_banner_invoice_delay')}</p>
        <p className="mb-0 mt-2">{t('manager_hub_dashboard_banner_invoice_delay_no_action')}</p>
        <p className="mb-0 mt-2">{t('manager_hub_dashboard_banner_invoice_delay_thanks')}</p>
      </OsdsText>
    </OsdsMessage>
  ) : null;
}
