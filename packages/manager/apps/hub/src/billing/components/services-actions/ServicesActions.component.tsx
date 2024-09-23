import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { BillingService } from '@/billing/types/billingServices.type';
import { RENEW_URL, SERVICE_TYPE } from '@/billing.constants';
import { useServiceLinks } from '@/billing/hooks/useServiceLinks';
import { ServiceLinks } from '@/billing/types/service-links.type';
import { useServiceActions } from '@/billing/hooks/useServiceActions';

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
    shell: { navigation },
    environment: { user },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();

  const trackAction = (hit: string, hasActionInEvent = true): void => {
    if (trackingPrefix) {
      trackClick({
        actionType: 'action',
        actions: [...trackingPrefix, ...[hasActionInEvent && 'action', hit]],
      });
    }
  };
  /* const serviceTypeParam = service.serviceType
    ? `&serviceType=${service.serviceType}`
    : '';
  const renewUrl = `${RENEW_URL[user.ovhSubsidiary] || RENEW_URL.default}${
    service.serviceId
  }`;
  const [organization, exchangeName] = service.serviceId.split(
    '/service/',
  );
  const exchangeBillingLink = `${autoRenewLink}/exchange?organization=${organization}&exchangeName=${exchangeName || service.serviceId}`;
  const cancelResiliationLink = service.serviceType === SERVICE_TYPE.EMAIL_DOMAIN
    ? `${autoRenewLink}/cancel-resiliation?serviceId=${service.serviceId}${serviceTypeParam}`
    : null;
  const deleteLink =
    service.serviceType &&
    `${autoRenewLink}/delete-${service.serviceType
      .replace(/_/g, '-')
      .toLowerCase()}?serviceId=${service.serviceId}`;
  const resiliationByEndRuleLink = `${autoRenewLink}/resiliation?serviceId=${service.id}&serviceName=${service.serviceId}${serviceTypeParam}`;

  let resiliateLink: string;
  let buyingLink: string;
  let renewLink: string;
  switch (service.serviceType) {
    case SERVICE_TYPE.EXCHANGE:
      resiliateLink = `${service.url}?action=resiliate`;
      renewLink = `${service.url}?tab=ACCOUNT`;
      break;
    case SERVICE_TYPE.EMAIL_DOMAIN:
      resiliateLink = `${autoRenewLink}/delete-email?serviceId=${service.serviceId}&name=${service.domain}`;
      break;
    case SERVICE_TYPE.SMS:
      buyingLink = navigation.getURL(
        'telecom',
        '#/sms/:serviceName/order',
        { serviceName: this.service.serviceId },
      );
      renewLink = navigation.getURL(
        'telecom',
        '#/sms/:serviceName/options/recredit',
        { serviceName: this.service.serviceId },
      );
      break;
    case SERVICE_TYPE.TELEPHONY:
      resiliateLink = navigation.getURL(
        'telecom',
        '#/telephony/:serviceName/administration/deleteGroup',
        { serviceName: service.serviceId },
      );
      break;
    case SERVICE_TYPE.PACK_XDSL:
      resiliateLink = navigation.getURL(
        'telecom',
        '#/pack/:serviceName',
        { serviceName: service.serviceId },
      );
      break;
    case SERVICE_TYPE.ALL_DOM:
      resiliateLink = service.canResiliateByEndRule()
        ? resiliationByEndRuleLink
        : `${autoRenewLink}/delete-all-dom?serviceId=${service.serviceId}&serviceType=${service.serviceType}`;
      break;
    case SERVICE_TYPE.OKMS:
    case SERVICE_TYPE.VRACK_SERVICES:
      resiliateLink = `${autoRenewLink}/terminate-service?id=${service.id}${serviceTypeParam}`;
      break;
    default:
      resiliateLink = service.canResiliateByEndRule()
        ? resiliationByEndRuleLink
        : autoRenewLink &&
        `${autoRenewLink}/delete?serviceId=${service.serviceId}${serviceTypeParam}`;
      break;
  }

  const items: ActionMenuItem[] = [];

  if (
    autoRenewLink &&
    service.hasDebt() &&
    !service.hasBillingRights(user.nichandle)
  ) {
    items.push({
      id: 1,
      label: t('billing_services_actions_menu_pay_bill'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-pay-bill');
      },
      href: `${autoRenewLink}/warn-nic?nic=${service.contactBilling}`,
    });
  }
  if (
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
      href: billingLink,
    });
  }
  if (
    autoRenewLink &&
    !service.hasParticularRenew() &&
    !service.hasPendingResiliation() &&
    !service.hasDebt()
  ) {
    if (
      !service.isOneShot() &&
      !service.hasManualRenew() &&
      service.canHandleRenew()
    ) {
      if (
        !service.isResiliated() &&
        !service.hasEngagement()
      ) {
        items.push({
          id: 2,
          label: t('billing_services_actions_menu_manage_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-configure-renew');
          },
          href: `${autoRenewLink}/update?serviceId=${service.serviceId}${serviceTypeParam}`,
        });
      }
      if (
        !service.canBeEngaged &&
        !service.hasPendingEngagement
      ) {
        items.push({
          id: 3,
          label: t('billing_services_actions_menu_anticipate_renew'),
          color: ODS_THEME_COLOR_INTENT.primary,
          onClick: () => {
            trackAction('go-to-anticipate-payment');
          },
          href: renewUrl,
        });
      }
    }
    if (
      service.hasManualRenew() &&
      service.canHandleRenew()
    ) {
      items.push({
        id: 4,
        disabled: service.hasForcedRenew(),
        label: t('billing_services_actions_menu_renew'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-renew-manually');
        },
        href: renewUrl,
      });
    }
  }
  if (service.hasPendingEngagement) {
    items.push({
      id: 5,
      label: t('billing_services_actions_menu_commit_cancel'),
      color: ODS_THEME_COLOR_INTENT.primary,
      // When we will fully migrate billing in React, we should add a possibility to give
      // the cancelCommitment link with props
      href: `${autoRenewLink}/${service.id}/cancel-commitment`,
    });
  }
  else if (
    service.canBeEngaged &&
    !service.isSuspended()
  ) {
    items.push({
      id: 5,
      disabled: service.hasForcedRenew(),
      label: t('billing_services_actions_menu_commit'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-manage-commitment', false);
      },
      // When we will fully migrate billing in React, we should add a possibility to give
      // the commitment link with props
      href: `${autoRenewLink}/${service.id}/commitment`,
    });
  }
  if (service.serviceType === SERVICE_TYPE.EXCHANGE) {
    if (service.menuItems?.manageEmailAccountsInBilling) {
      items.push({
        id: 6,
        label: t('billing_services_actions_menu_exchange_update'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-modify-billing-Exchange', false);
        },
        href: exchangeBillingLink,
      });
    }
    else if (service.menuItems?.manageEmailAccountsInExchange) {
      items.push({
        id: 6,
        label: t('billing_services_actions_menu_exchange_update_accounts'),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-modify-billing-ExchangeAccounts', false);
        },
        href: exchangeBillingLink,
      });
    }
  }
  if (service.serviceType === SERVICE_TYPE.PACK_XDSL) {
    if (
      (service.shouldDeleteAtExpiration() || !service.isResiliated()) &&
      !service.hasDebt() &&
      !service.hasPendingResiliation() &&
      resiliateLink &&
      service.hasAdminRights(user.auth.account)
    ) {
      items.push({
        id: 7,
        label: t(`billing_services_actions_menu_resiliate${service.hasEngagement() ? 'my_engagement' : ''}`),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-resiliate');
        },
        href: resiliateLink,
      });
    }
  }
  else if (
    (service.shouldDeleteAtExpiration() || !service.isResiliated()) &&
    !service.hasDebt() &&
    !service.hasPendingResiliation()
  ) {
    if (
      resiliateLink &&
      (service.hasAdminRights(user.auth.account) || service.hasAdminRights(user.nichandle))
    ) {
      items.push({
        id: 8,
        label: t(`billing_services_actions_menu_resiliate${service.hasEngagement() ? 'my_engagement' : ''}`),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-resiliate');
        },
        href: resiliateLink,
      });
    }
    if (
      autoRenewLink &&
      service.canBeDeleted()
    ) {
      items.push({
        id: 8,
        label: t(`billing_services_actions_menu_resiliate_${service.serviceType}`),
        color: ODS_THEME_COLOR_INTENT.primary,
        onClick: () => {
          trackAction('go-to-resiliate');
        },
        href: deleteLink,
      });
    }
  }
  if (service.serviceType === SERVICE_TYPE.SMS) {
    items.push({
      id: 9,
      label: t('billing_services_actions_menu_sms_credit'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-buy-SMScredits');
      },
      // getURL => async
      href: buyingLink,
      target: OdsHTMLAnchorElementTarget._blank,
      rel: OdsHTMLAnchorElementRel.noopener,
    });
    items.push({
      id: 10,
      label: t('billing_services_actions_menu_sms_renew'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-configure-SMSautoreload');
      },
      // getURL => async
      href: renewLink,
      target: OdsHTMLAnchorElementTarget._blank,
      rel: OdsHTMLAnchorElementRel.noopener,
    });
  }
  if (
    cancelResiliationLink &&
    (service.canBeUnresiliated(user.nichandle) || service.canCancelResiliationByEndRule())
  ) {
    items.push({
      id: 11,
      label: t('billing_services_actions_menu_resiliate_cancel'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-cancel-resiliation');
      },
      href: cancelResiliationLink,
      target: OdsHTMLAnchorElementTarget._top,
    });
  }
  if (
    service.url &&
    !service.isByoipService()
  ) {
    items.push({
      id: 11,
      label: t('billing_services_actions_menu_see_dashboard'),
      color: ODS_THEME_COLOR_INTENT.primary,
      onClick: () => {
        trackAction('go-to-service');
      },
      href: service.url,
      target: OdsHTMLAnchorElementTarget._top,
    });
  } */
  const links = useServiceLinks(service, autoRenewLink);
  const items: ActionMenuItem[] = useServiceActions(
    service,
    links,
    trackingPrefix,
  );

  /* if (links.warnBillingNic) {
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
      disabled: service.hasForcedRenew(),
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
      label: t(`billing_services_actions_menu_resiliate${service.hasEngagement() ? 'my_engagement' : ''}`),
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
      label: t(`billing_services_actions_menu_resiliate_${service.serviceType}`),
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
  } */
  const shouldBeDisplayed =
    Boolean(autoRenewLink) ||
    service.canBeEngaged ||
    service.hasPendingEngagement;

  return shouldBeDisplayed ? (
    <ActionMenu items={items} isCompact icon={ODS_ICON_NAME.ELLIPSIS} />
  ) : null;
}
