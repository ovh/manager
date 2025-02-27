import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { BillingService } from '@/billing/types/billingServices.type';
import { ServiceLinks } from '@/billing/types/service-links.type';
import { RENEW_URL, SERVICE_TYPE } from '@/billing.constants';

export const useServiceLinks = (
  service: BillingService,
  autoRenewLink?: string,
) => {
  const {
    shell: { navigation },
    environment: { user },
  } = useContext(ShellContext);
  const [links, setLinks] = useState<ServiceLinks>({});

  useEffect(() => {
    const determineLinks = async () => {
      const availableLinks: ServiceLinks = {};
      const serviceTypeParam = service.serviceType
        ? `&serviceType=${service.serviceType}`
        : '';
      const renewUrl = `${RENEW_URL[user.ovhSubsidiary] || RENEW_URL.default}${
        service.serviceId
      }`;
      const [organization, exchangeName] = service.serviceId.split('/service/');
      // When we will fully migrate billing in React, we should add a possibility to give
      // the cancelResiliation link (with an additional parameter in useServiceLinks)
      const cancelResiliationLink =
        service.serviceType !== SERVICE_TYPE.EMAIL_DOMAIN
          ? `${autoRenewLink}/cancel-resiliation?serviceId=${service.serviceId}${serviceTypeParam}`
          : null;
      // When we will fully migrate billing in React, we should add a possibility to give
      // the resiliationByEndRule link (with an additional parameter in useServiceLinks)
      const resiliationByEndRuleLink = `${autoRenewLink}/resiliation?serviceId=${service.id}&serviceName=${service.serviceId}${serviceTypeParam}`;

      let resiliateLink: string;
      switch (service.serviceType) {
        case SERVICE_TYPE.EXCHANGE:
          resiliateLink = `${service.url}?action=resiliate`;
          break;
        case SERVICE_TYPE.EMAIL_DOMAIN:
          resiliateLink = `${autoRenewLink}/delete-email?serviceId=${service.serviceId}&name=${service.domain}`;
          break;
        case SERVICE_TYPE.TELEPHONY:
          resiliateLink = (await navigation.getURL(
            'telecom',
            '#/telephony/:serviceName/administration/deleteGroup',
            { serviceName: service.serviceId },
          )) as string;
          break;
        case SERVICE_TYPE.PACK_XDSL:
          resiliateLink = (await navigation.getURL(
            'telecom',
            '#/pack/:serviceName',
            { serviceName: service.serviceId },
          )) as string;
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

      if (service.hasPendingEngagement) {
        availableLinks.cancelCommitment = `${autoRenewLink}/${service.id}/cancel-commitment`;
      }

      if (
        autoRenewLink &&
        service.hasDebt() &&
        !service.hasBillingRights(user.nichandle)
      ) {
        availableLinks.warnBillingNic = `${autoRenewLink}/warn-nic?nic=${service.contactBilling}`;
      }
      if (service.hasDebt() && service.hasBillingRights(user.nichandle)) {
        availableLinks.payBill = (await navigation.getURL(
          'dedicated',
          '#/billing/history',
          {},
        )) as string;
      }
      if (
        autoRenewLink &&
        !service.hasParticularRenew() &&
        !service.hasPendingResiliation() &&
        !service.hasDebt()
      ) {
        if (!service.isOneShot() && service.canHandleRenew()) {
          if (
            !service.isResiliated() &&
            !service.hasForcedRenew() &&
            !service.hasEngagement()
          ) {
            availableLinks.configureRenewal = `${autoRenewLink}/update?serviceId=${service.serviceId}${serviceTypeParam}`;
          }
          if (
            !service.hasManualRenew() &&
            !service.canBeEngaged &&
            !service.hasPendingEngagement
          ) {
            availableLinks.anticipatePayment = renewUrl;
          }
        }
        if (service.hasManualRenew() && service.canHandleRenew()) {
          availableLinks.renewManually = renewUrl;
        }
      }
      if (service.serviceType === SERVICE_TYPE.SMS) {
        availableLinks.buySMSCredits = (await navigation.getURL(
          'telecom',
          '#/sms/:serviceName/order',
          { serviceName: service.serviceId },
        )) as string;
        availableLinks.configureSMSAutoReload = (await navigation.getURL(
          'telecom',
          '#/sms/:serviceName/options/recredit',
          { serviceName: service.serviceId },
        )) as string;
      }
      if (
        cancelResiliationLink &&
        (service.canBeUnresiliated(user.nichandle) ||
          service.canCancelResiliationByEndRule())
      ) {
        availableLinks.cancelResiliation = cancelResiliationLink;
      }
      if (service.url && !service.isByoipService()) {
        availableLinks.seeService = service.url;
      }
      return availableLinks;
    };
    determineLinks().then(setLinks);
  }, [service, autoRenewLink]);

  return links;
};
