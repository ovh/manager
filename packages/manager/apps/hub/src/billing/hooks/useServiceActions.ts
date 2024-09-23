import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ServiceLinks } from '@/billing/types/service-links.type';
import { BillingService } from '@/billing/types/billingServices.type';

export const useServiceActions = (
  service: BillingService,
  getLinksPromise: Promise<ServiceLinks>,
  trackingPrefix?: string[],
) => {
  const { t } = useTranslation('billing/actions');
  const { trackClick } = useOvhTracking();

  const trackAction = (hit: string, hasActionInEvent = true): void => {
    if (trackingPrefix) {
      trackClick({
        actionType: 'action',
        actions: [...trackingPrefix, ...[hasActionInEvent && 'action', hit]],
      });
    }
  };
  const [actions, setActions] = useState<ActionMenuItem[]>([]);
  getLinksPromise.then((links: ServiceLinks) => {
    const items: ActionMenuItem[] = [];

    if (links.warnBillingNic) {
      items.push({
        id: 1,
        label: t('billing_services_actions_menu_pay_bill'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-pay-bill');
        },
        href: links.warnBillingNic,
      });
    }
    if (links.payBill) {
      items.push({
        id: 2,
        label: t('billing_services_actions_menu_pay_bill'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-pay-bill');
        },
        href: links.payBill,
      });
    }
    if (links.configureRenewal) {
      items.push({
        id: 3,
        label: t('billing_services_actions_menu_manage_renew'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-configure-renew');
        },
        href: links.configureRenewal,
      });
    }
    if (links.anticipatePayment) {
      items.push({
        id: 4,
        label: t('billing_services_actions_menu_anticipate_renew'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-anticipate-payment');
        },
        href: links.anticipatePayment,
      });
    }
    if (links.renewManually) {
      items.push({
        id: 5,
        disabled: service.hasForcedRenew(),
        label: t('billing_services_actions_menu_renew'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-renew-manually');
        },
        href: links.renewManually,
      });
    }
    if (links.cancelCommitment) {
      items.push({
        id: 5,
        label: t('billing_services_actions_menu_commit_cancel'),
        color: ODS_THEME_COLOR_INTENT.primary,
        href: links.cancelCommitment,
      });
    }
    if (links.manageCommitment) {
      items.push({
        id: 5,
        label: t('billing_services_actions_menu_commit'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-manage-commitment', false);
        },
        href: links.manageCommitment,
      });
    }
    if (links.modifyExchangeBilling) {
      items.push({
        id: 6,
        label: t('billing_services_actions_menu_exchange_update'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-modify-billing-Exchange', false);
        },
        href: links.modifyExchangeBilling,
      });
    }
    if (links.configureExchangeAccountsRenewal) {
      items.push({
        id: 7,
        label: t('billing_services_actions_menu_exchange_update_accounts'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-modify-billing-ExchangeAccounts', false);
        },
        href: links.configureExchangeAccountsRenewal,
      });
    }
    if (links.resiliate) {
      items.push({
        id: 8,
        label: t(
          `billing_services_actions_menu_resiliate${
            service.hasEngagement() ? 'my_engagement' : ''
          }`,
        ),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-resiliate');
        },
        href: links.resiliate,
      });
    }
    if (links.resiliateByDeletion) {
      items.push({
        id: 9,
        label: t(
          `billing_services_actions_menu_resiliate_${service.serviceType}`,
        ),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-resiliate');
        },
        href: links.resiliateByDeletion,
      });
    }
    if (links.buySMSCredits) {
      items.push({
        id: 10,
        label: t('billing_services_actions_menu_sms_credit'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-buy-SMScredits');
        },
        href: links.buySMSCredits,
        target: OdsHTMLAnchorElementTarget._blank,
        rel: OdsHTMLAnchorElementRel.noopener,
      });
    }
    if (links.configureSMSAutoReload) {
      items.push({
        id: 11,
        label: t('billing_services_actions_menu_sms_renew'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-configure-SMSautoreload');
        },
        href: links.configureSMSAutoReload,
        target: OdsHTMLAnchorElementTarget._blank,
        rel: OdsHTMLAnchorElementRel.noopener,
      });
    }
    if (links.cancelResiliation) {
      items.push({
        id: 12,
        label: t('billing_services_actions_menu_resiliate_cancel'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-cancel-resiliation');
        },
        href: links.cancelResiliation,
        target: OdsHTMLAnchorElementTarget._top,
      });
    }
    if (links.seeService) {
      items.push({
        id: 13,
        label: t('billing_services_actions_menu_see_dashboard'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-service');
        },
        href: links.seeService,
        target: OdsHTMLAnchorElementTarget._top,
      });
    }
    setActions(items);
  });

  return actions;
};
