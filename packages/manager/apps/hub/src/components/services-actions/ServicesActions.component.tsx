import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { BillingService } from '@/types/billingServices.type';

type ServicesActionsProps = {
  service: BillingService;
  autoRenewLink: string;
  trackingPrefix: string[];
};

export default function ServicesActions({
  service,
  autoRenewLink,
  trackingPrefix,
}: ServicesActionsProps) {
  const { t } = useTranslation('billing/actions');
  const {
    environment: { user },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();

  const trackAction = (hit: string, hasActionInEvent = true): void => {
    if (this.trackingPrefix) {
      trackClick({
        actionType: 'action',
        actions: [...trackingPrefix, ...[hasActionInEvent && 'action', hit]],
      });
    }
  };

  const items: ActionMenuItem[] = [];
  const autoRenewLinkExists = Boolean(autoRenewLink);
  if (
    autoRenewLinkExists &&
    service.hasDebt() &&
    service.hasBillingRights(user.nichandle)
  ) {
    items.push({
      id: 1,
      label: t('billing_services_actions_menu_pay_bill'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-pay-bill');
      },
      href: 'warningLink',
    });
  }
  const shouldBeDisplayed =
    autoRenewLinkExists || service.canBeEngaged || service.hasPendingEngagement;

  return shouldBeDisplayed ? (
    <ActionMenu items={items} isCompact icon={ODS_ICON_NAME.ELLIPSIS} />
  ) : null;
}
