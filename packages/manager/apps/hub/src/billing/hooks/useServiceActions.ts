import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ServiceLinks } from '@/billing/types/service-links.type';
import { BillingService } from '@/billing/types/billingServices.type';

export type ServiceAction = {
  color?: ODS_THEME_COLOR_INTENT;
  disabled?: boolean;
  external?: boolean;
  href: string;
  label: string;
  onClick?: () => void;
  target?: OdsHTMLAnchorElementTarget;
  rel?: OdsHTMLAnchorElementRel;
};

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
  const [actions, setActions] = useState<ServiceAction[]>([]);
  useEffect(() => {
    getLinksPromise.then((links: ServiceLinks) => {
      const items: ServiceAction[] = [];

      if (links.warnBillingNic) {
        items.push({
          label: t('billing_services_actions_menu_pay_bill'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-pay-bill');
          },
          href: links.warnBillingNic,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.payBill) {
        items.push({
          label: t('billing_services_actions_menu_pay_bill'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-pay-bill');
          },
          href: links.payBill,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.configureRenewal) {
        items.push({
          label: t('billing_services_actions_menu_manage_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-configure-renew');
          },
          href: links.configureRenewal,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.anticipatePayment) {
        items.push({
          label: t('billing_services_actions_menu_anticipate_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-anticipate-payment');
          },
          href: links.anticipatePayment,
          external: true,
        });
      }
      if (links.renewManually) {
        items.push({
          disabled: service.hasForcedRenew(),
          label: t('billing_services_actions_menu_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-renew-manually');
          },
          href: links.renewManually,
          external: true,
          target: OdsHTMLAnchorElementTarget._blank,
          rel: OdsHTMLAnchorElementRel.noopener,
        });
      }
      if (links.manageCommitment) {
        items.push({
          label: t('billing_services_actions_menu_commit'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-manage-commitment', false);
          },
          href: links.manageCommitment,
        });
      }
      if (links.cancelCommitment) {
        items.push({
          label: t('billing_services_actions_menu_commit_cancel'),
          color: ODS_THEME_COLOR_INTENT.primary,
          href: links.cancelCommitment,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.modifyExchangeBilling) {
        items.push({
          label: t('billing_services_actions_menu_exchange_update'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-modify-billing-Exchange', false);
          },
          href: links.modifyExchangeBilling,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.configureExchangeAccountsRenewal) {
        items.push({
          label: t('billing_services_actions_menu_exchange_update_accounts'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-modify-billing-ExchangeAccounts', false);
          },
          href: links.configureExchangeAccountsRenewal,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.resiliate) {
        items.push({
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
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.resiliateByDeletion) {
        items.push({
          label: t(
            `billing_services_actions_menu_resiliate_${service.serviceType}`,
          ),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-resiliate');
          },
          href: links.resiliateByDeletion,
          target: OdsHTMLAnchorElementTarget._top,
        });
      }
      if (links.buySMSCredits) {
        items.push({
          label: t('billing_services_actions_menu_sms_credit'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-buy-SMScredits');
          },
          href: links.buySMSCredits,
          target: OdsHTMLAnchorElementTarget._blank,
          rel: OdsHTMLAnchorElementRel.noopener,
          external: true,
        });
      }
      if (links.configureSMSAutoReload) {
        items.push({
          label: t('billing_services_actions_menu_sms_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-configure-SMSautoreload');
          },
          href: links.configureSMSAutoReload,
          target: OdsHTMLAnchorElementTarget._blank,
          rel: OdsHTMLAnchorElementRel.noopener,
          external: true,
        });
      }
      if (links.cancelResiliation) {
        items.push({
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
  }, []);

  return actions;
};
