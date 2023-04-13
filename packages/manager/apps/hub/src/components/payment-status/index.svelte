<script lang="ts">
 import { ActionMenu, Card, Badge, Size, Status, Skeleton } from '$components/ui/index';
 import { t } from '$lib/translations';
 import { BillingService } from '@ovh-ux/manager-models';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { RENEW_URL } from './constants.ts';

 const SERVICE_STATES = {
     error: ['expired', 'delete_at_expiration'],
     success: ['auto', 'automatic'],
     warning: ['manual', 'manualPayment'],
     info: ['billing_suspended', 'forced_manual'],
 };

 const action = {
     url: '',
     label: $t('common.manager_hub_see_all')
 };

 const fetchPaymentStatus = async() => {
     const res = await fetch(`/engine/2api/hub/billingServices`)

     if (res.ok) {
         const services = await res.json();
         return services.data.billingServices.data.data.map(s => new BillingService(s));
     }
 };

 const shouldHideAutorenewStatus = (service) => {
     return service.isOneShot() || ['SMS'].includes(service.serviceType);
 };

 const getActions = async (service) => {

     const serviceTypeParam = service.serviceType ? `&serviceType=${service.serviceType}` : '';
     let autorenewLink = await $shellClient.navigation.getURL('dedicated', '#/billing/autorenew');
     action.url = autorenewLink;
     let { user } = await $shellClient.environment.getEnvironment();
     const renewUrl = `${RENEW_URL[user.ovhSubsidiary] || RENEW_URL.default}${service.serviceId}`;
     const commitmentLink = `${autorenewLink}/${service.id}/commitment`;
     const cancelCommitmentLink = `${autorenewLink}/${service.id}/cancel-commitment`;
     const cancelResiliationLink =  `${autorenewLink}/cancel-resiliation?serviceId=${service.serviceId}${serviceTypeParam}`;
     const warningLink = `${autorenewLink}/warn-nic?nic=${service.contactBilling}`;
     const billingLink = await $shellClient.navigation.getURL('dedicated', '#/billing/history');
     const updateLink = `${autorenewLink}/update?serviceId=${service.serviceId}${serviceTypeParam}`;
     let renewLink = service.serviceType === 'EXCHANGE' ? `${service.url}?tab=ACCOUNT` : null;

     if (service.serviceType === 'SMS') {
         renewLink = await $shellClient.navigation.getURL(
             'telecom',
             '#/sms/:serviceName/options/recredit',
             {
                 serviceName: service.serviceId
             }
         );
     }

     let resiliateLink;
     switch( service.serviceType) {
         case 'EXCHANGE':
             resiliateLink = `${service.url}?action=resiliate`;
             break;
         case 'EMAIL_DOMAIN':
             resiliateLink = `${autorenewLink}/delete-email?serviceId=${service.serviceId}&name=${service.domain}`;
             break;
         case 'ALL_DOM':
             resiliateLink = service.canResiliateByEndRule()
                           ? resiliationByEndRuleLink
                           : `${autorenewLink}/delete-all-dom?serviceId=${service.serviceId}&serviceType=${service.serviceType}`;
             break;
         default:
             resiliateLink = service.canResiliateByEndRule()
                           ? resiliationByEndRuleLink
                           : autorenewLink &&
                             `${autorenewLink}/delete?serviceId=${service.serviceId}${serviceTypeParam}`;
             break;
     }

     let actions = [];
     if (autorenewLink && service.hasDebt() && !service.hasBillingRights(user)) {
         actions.push({
             url: warningLink,
             label: $t('payment-status.billing_services_actions_menu_pay_bill'),
             isExternal: false,
             target: '_top'
         });
     }

     if (service.hasDebt() && service.hasBillingRights(user)) {
         actions.push({
             url: billingLink,
             label: $t('payment-status.billing_services_actions_menu_pay_bill'),
             isExternal: false,
             target: '_top'
         });
     }

     if (autorenewLink && !service.hasParticularRenew() && !service.hasPendingResiliation() && !service.hasDebt()) {
         if (!service.isOneShot() && !service.hasForcedRenew() && !service.isResiliated() && service.canHandleRenew() && !service.hasEngagement()) {
             actions.push({
                 url: updateLink,
                 label: $t('payment-status.billing_services_actions_menu_manage_renew'),
                 isExternal: false,
                 target: '_top'
             });
         }

         if (!service.isOneShot() && !service.hasManualRenew() && service.canHandleRenew() && !service.canBeEngaged && !service.hasPendingEngagement) {
             actions.push({
                 url: renewUrl,
                 label: $t('payment-status.billing_services_actions_menu_anticipate_renew'),
                 isExternal: true,
                 target: '_top'
             });
         }

         if (service.hasManualRenew() && /*!service.isInDebt() &&*/ service.canHandleRenew()) {
             actions.push({
                 url: renewUrl,
                 disabled: service.hasForcedRenew(),
                 label: $t('payment-status.billing_services_actions_menu_renew'),
                 isExternal: true,
                 target: '_top'
             });
         }
     }

     if (service.canBeEngaged && !service.hasPendingEngagement && !service.isSuspended()) {
         actions.push({
             url: commitmentLink,
             label: $t('payment-status.billing_services_actions_menu_commit'),
             isExternal: false,
             target: '_top'
         });
     }

     if (service.hasPendingEngagement) {
         actions.push({
             url: cancelCommitmentLink,
             label: $t('payment-status.billing_services_actions_menu_commit_cancel'),
             isExternal: false,
             target: '_top'
         });
     }

     if (service.serviceType === 'EMAIL_EXCHANGE') {
         if (service.menuItems.manageEmailAccountsInBilling) {
             actions.push({
                 url: getExchangeBilling,
                 label: $t('payment-status.billing_services_actions_menu_exchange_update'),
                 isExternal: false,
                 target: '_top'
             });
         }

         if (service.menuItems.manageEmailAccountsInExchange) {
             actions.push({
                 url: renewLink,
                 label: $t('payment-status.billing_services_actions_menu_exchange_update_accounts'),
                 isExternal: false,
                 target: '_top'
             });
         }
     }

     if ((!service.shouldDeleteAtExpiration() || !service.isResiliated()) && !service.hasDebt() && !service.hasPendingResiliation()) {
         if (resiliateLink && service.canBeResiliated(user.nichandle)) {
             actions.push({
                 url: resiliateLink,
                 label: $t(!service.hasEngagement() ? 'payment-status.billing_services_actions_menu_resiliate' : 'payment-status.billing_services_actions_menu_resiliate_my_engagement'),
                 isExternal: false,
                 target: '_top'
             });
         }

         if (autorenewLink && service.canBeDeleted()) {

         }

         if (cancelResiliationLink && (service.canBeUnresiliated(user.nichandle) || service.canCancelResiliationByEndRule())) {
             actions.push({
                 url: cancelResiliationLink,
                 label: $t(`payment-status.billing_services_actions_menu_resiliate_cancel`),
                 isExternal: false,
                 target: '_top'
             });
         }
     }

     if (service.serviceType === 'SMS') {
         actions.push({
             url: buyingLink,
             label: $t(`payment-status.billing_services_actions_menu_sms_credit`),
             isExternal: true,
             target: '_top'
         });

         actions.push({
             url: renewLink,
             label: $t(`payment-status.billing_services_actions_menu_sms_renew`),
             isExternal: true,
             target: '_top'
         });
     }
     if (service.url) {
         actions.push({
             url: service.url,
             label: $t(`payment-status.billing_services_actions_menu_see_dashboard`),
             isExternal: false,
             target: '_top'
         });
     }

     return actions;
 };
</script>

<Card title={$t('payment-status.ovh_manager_hub_payment_status_tile_title')} count="4" {action}>
    {#await fetchPaymentStatus()}
        <Skeleton rows="4" />
    {:then paymentStatus}
        <div class="grid grid-cols-1 space-y-2 divide-y">
            {#each paymentStatus as billingService}
                <div class="flex flex-row items-center justify-between w-full pt-2">
                    <div class="grow flex flex-col">
                        <a href={billingService.url} target="_top">{billingService.domain}</a>
                        <span class="text-sm text-gray-700">{$t(`services.manager_hub_products_${billingService.serviceType}`)}</span>
                    </div>
                    <div class="w-1/4 flex-none">

                        {#if !billingService.hasDebt() && !shouldHideAutorenewStatus(billingService)}
                            {#if billingService.hasDebt()}
                                <Badge status={Status.Error} size={Size.Default}>
                                    {$t(`payment-status.manager_billing_service_status_${billingService.getRenew()}`)}
                                </Badge>
                            {/if}

                            {#if SERVICE_STATES.warning.includes(billingService.getRenew())}
                                <Badge status={Status.Warning} size={Size.Default}>
                                    {$t(`payment-status.manager_billing_service_status_${billingService.getRenew()}`)}
                                </Badge>
                            {/if}

                            {#if SERVICE_STATES.success.includes(billingService.getRenew())}
                                <Badge status={Status.Success} size={Size.Default}>
                                    {$t(`payment-status.manager_billing_service_status_${billingService.getRenew()}`)}
                                </Badge>
                            {/if}

                            {#if SERVICE_STATES.info.includes(billingService.getRenew())}
                                <Badge status={Status.Info} size={Size.Default}>
                                    {$t(`payment-status.manager_billing_service_status_${billingService.getRenew()}`)}
                                </Badge>
                            {/if}
                        {/if}

                        {#if !billingService.isBillingSuspended() }
                            <div class="my-2 text-gray-700">
                                {#if billingService.isOneShot() && !billingService.isResiliated() && !billingService.hasPendingResiliation()}
                                    <span>-</span>
                                {/if}
                                {#if billingService.hasManualRenew() && !billingService.isResiliated() && !billingService.hasDebt()}
                                    <span>
                                        {$t('payment-status.ovh_manager_hub_payment_status_tile_before', { date: billingService.formattedExpiration })}
                                    </span>
                                {/if}
                                {#if billingService.isResiliated() || billingService.hasPendingResiliation()}
                                    <span>
                                        {$t('payment-status.ovh_manager_hub_payment_status_tile_renew', { date: billingService.formattedExpiration})}
                                    </span>
                                {/if}
                                {#if billingService.hasAutomaticRenewal() && !billingService.isOneShot() && !billingService.hasDebt() && !billingService.isResiliated() && !billingService.hasPendingResiliation()}
                                    <span>{billingService.formattedExpiration}</span>
                                {/if}
                                {#if billingService.hasDebt()}
                                    <span>{$t('payment-status.ovh_manager_hub_payment_status_tile_now')}</span>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    <div class="w-22 flex-none">
                        {#await getActions(billingService)}
                        {:then actions}
                            <ActionMenu {actions} />
                        {/await}
                    </div>
                </div>
            {/each}
        </div>
    {:catch error}
        <p>Error loading fetchPaymentStatus: {error.message}</p>
    {/await}
</Card>
