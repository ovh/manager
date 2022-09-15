import { TFunction } from 'react-i18next';

import { BillingData } from '@/api/dashboard/billing';
import { DashboardTileDefinitionAction } from '@/components/Dashboard';
import { RENEW_URL } from '@/consts/billing';
import { SERVICE_TYPE } from '@/consts/services';
import {
  canBeDeleted,
  canBeResiliated,
  canBeUnresiliated,
  canCancelResiliationByEndRule,
  canHandleRenew,
  canResiliateByEndRule,
  hasBillingRights,
  hasDebt,
  hasEngagement,
  hasForcedRenew,
  hasManualRenew,
  hasParticularRenew,
  hasPendingResiliation,
  isOneShot,
  isResiliated,
  shouldDeleteAtExpiration,
} from '@/utils/billingService';

export function computeBillingActions(
  data: BillingData,
  t: TFunction<"dashboard",undefined>,
  userNic: string,
  ovhSubsidiary: string,
  trackingPrefix : string,
  dashboardView: boolean,
): DashboardTileDefinitionAction[] {
  const actions = [];

  if (data.autorenewLink) {
    const serviceTypeParam = data.serviceType
      ? `&serviceType=${data.serviceType}`
      : '';
    const resiliationByEndRuleLink = `${data.autorenewLink}/resiliation?serviceId=${data.serviceId}&serviceName=${data.serviceName}${serviceTypeParam}`;

    let resiliateLink;
    switch(data.serviceType) {
      case SERVICE_TYPE.EXCHANGE:
        resiliateLink = `${data.url}?action=resiliate`;
        break;
      case SERVICE_TYPE.EMAIL_DOMAIN:
        resiliateLink = `${data.autorenewLink}/delete-email?serviceId=${data.serviceId}&name=${this.service.domain}`; // TODO
        break;
      case SERVICE_TYPE.SMS:
        break;
      case SERVICE_TYPE.ALL_DOM:
        resiliateLink = canResiliateByEndRule(data)
          ? resiliationByEndRuleLink
          : `${data.autorenewLink}/delete-all-dom?serviceId=${data.serviceId}&serviceType=${data.serviceType}`;
        break;
      default:
        resiliateLink = canResiliateByEndRule(data)
          ? resiliationByEndRuleLink
          : data.autorenewLink &&
            `${data.autorenewLink}/delete?serviceId=${data.serviceId}${serviceTypeParam}`;
        break;
    }

    const cancelResiliationLink = (data.serviceType === SERVICE_TYPE.EMAIL_DOMAIN) ? null : (
      `${data.autorenewLink}/cancel-resiliation?serviceId=${data.serviceId}${serviceTypeParam}`
    );

    // Service is unpaid - special actions to pay the bill
    if (hasDebt(data)) {
      if (!hasBillingRights(data, userNic)) {
        actions.push({
          href: `${data.autorenewLink}/warn-nic?nic=${data.contacts.billing}`,
          label: t('billing_services_actions_menu_pay_bill'),
          name: 'pay_bill_warn',
          trackAction: 'go-to-pay-bill',
          trackingPrefix,
        });
      } else {
        actions.push({
          href: data.billingLink,
          label: t('billing_services_actions_menu_pay_bill'),
          name: 'pay_bill',
          trackAction: 'go-to-pay-bill',
          trackingPrefix,
        });
      }
    }

    if (!hasParticularRenew(data) && !hasPendingResiliation(data) && !hasDebt(data) && canHandleRenew(data)) {
      const renewUrl = `${RENEW_URL[ovhSubsidiary as keyof typeof RENEW_URL] || RENEW_URL.default}${data.serviceId}`;

      // Service in autorenew
      if (!isOneShot(data) && !hasForcedRenew(data) && !isResiliated(data) && !hasEngagement(data)) {
        actions.push({
          href: `${data.autorenewLink}/update?serviceId=${data.serviceId}${serviceTypeParam}`,
          label: t('billing_services_actions_menu_manage_renew'),
          name: 'configure_renew',
          trackAction: 'go-to-configure-renew',
          trackingPrefix,
        });
      }
      if (!isOneShot(data) && !hasManualRenew(data)) {
        actions.push({
          href: renewUrl,
          isExternal: true,
          label: t('billing_services_actions_menu_anticipate_renew'),
          name: 'anticipate_payment',
          trackAction: 'go-to-anticipate-payment',
          trackingPrefix,
        });
      }

      // Service in manual renew
      if (hasManualRenew(data)) {
        actions.push({
          disabled: hasForcedRenew(data),
          href: renewUrl,
          label: t('billing_services_actions_menu_renew'),
          name: 'renew_manually',
          title: t('billing_services_actions_menu_renew_label', { serviceName: data.serviceId }),
          trackAction: 'go-to-renew-manually',
          trackingPrefix,
        });
      }
    }

    // Exchange
    if (data.serviceType === SERVICE_TYPE.EXCHANGE) {
      // if (menuItems.manageEmailAccountsInBilling) {
        let exchangeBillingUrl;
        if (/\/service\//.test(data.serviceId)) {
          const [organization, exchangeName] = data.serviceId.split('/service/');
          exchangeBillingUrl = `${data.autorenewLink}/exchange?organization=${organization}&exchangeName=${exchangeName}`;
        } else {
          exchangeBillingUrl = `${data.autorenewLink}/exchange?organization=${data.serviceId}&exchangeName=${data.serviceId}`;
        }
        actions.push({
          href: exchangeBillingUrl,
          label: t('billing_services_actions_menu_exchange_update'),
          name: 'renew_modify_billing_Exchange',
          trackAction: 'go-to-modify-billing-Exchange',
          trackingPrefix,
        });
      //}
      // if (menuItems.manageEmailAccountsInExchange) {
        actions.push({
          href: `${data.url}?tab=ACCOUNT`,
          label: t('billing_services_actions_menu_exchange_update_accounts'),
          name: 'renew_modify_billing_ExchangeAccounts',
          trackAction: 'go-to-modify-billing-ExchangeAccounts',
          trackingPrefix,
        });
      //}
    }

    if ((!shouldDeleteAtExpiration(data) || !isResiliated(data)) && !hasDebt(data) && !hasPendingResiliation(data)) {
      if (resiliateLink && canBeResiliated(data, userNic)) {
        actions.push({
          href: resiliateLink,
          label: hasEngagement(data) ? t('billing_services_actions_menu_resiliate_my_engagement') : t('billing_services_actions_menu_resiliate'),
          name: 'resiliate',
          trackAction: 'go-to-resiliate',
          trackingPrefix,
        });
      }
      if (canBeDeleted(data)) {
        actions.push({
          href: `${data.autorenewLink}/delete-${data.serviceType.replace(/_/g, '-').toLowerCase()}?serviceId=${data.serviceId}`,
          label: t(`billing_services_actions_menu_resiliate_${data.serviceType}`),
          name: 'delete',
          trackAction: 'go-to-resiliate',
          trackingPrefix,
        });
      }
    }

    // SMS
    if (data.serviceType === SERVICE_TYPE.SMS) {
      actions.push({
        href: data.buyingLink,
        isExternal: true,
        label: t('billing_services_actions_menu_sms_credit'),
        name: 'buy_SMScredits',
        trackAction: 'go-to-buy-SMScredits',
        trackingPrefix,
      });
      actions.push({
        href: data.recreditLink,
        isExternal: true,
        label: t('billing_services_actions_menu_sms_renew'),
        name: 'sms_renew',
        trackAction: 'go-to-configure-SMSautoreload',
        trackingPrefix,
      });
    }

    // Service w termination asked by the customer
    if (cancelResiliationLink && (canBeUnresiliated(data, userNic)) || canCancelResiliationByEndRule(data)) {
      actions.push({
        href: cancelResiliationLink,
        label: t('billing_services_actions_menu_resiliate_cancel'),
        name: 'cancel_resiliation',
        trackAction: 'go-to-cancel-resiliation',
        trackingPrefix,
      });
    }

    // Other (not displayed in dashboard view)
    if (!dashboardView && data.url) {
      actions.push({
        href: data.url,
        label: t('billing_services_actions_menu_see_dashboard'),
        name: 'service_dashboard',
        trackAction: 'go-to-service',
        trackingPrefix,
      });
    }
  }

  return actions;
}
