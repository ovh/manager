<script lang="ts">
 import moment from 'moment';
 import { onMount } from 'svelte';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { useShellClient } from '@ovh-ux/shell';
 import { defineApplicationVersion } from '@ovh-ux/request-tagger';
 import { isTopLevelApplication } from '@ovh-ux/manager-config';
 import { Constants} from "$lib/constants";
 import { t, locale, loadTranslations } from '$lib/translations';

 import Banner from '$components/banner/index.svelte';
 import NotificationsBanner from '$components/notifications/index.svelte';
 import BillingSummary from '$components/billing-summary/index.svelte';
 import LastOrder from '$components/order-tracking/index.svelte';
 import DashboardServices from '$components/services/index.svelte';
 import CardPaymentStatus from '$components/payment-status/index.svelte';
 import CardSupport from '$components/support/index.svelte';

 let user = {};
 let isMounted = false;
 
 onMount(async () => {
     window.moment = moment;
     let client = await useShellClient('hub');
     $shellClient = client;

     const lang = await client.i18n.getLocale();
     await loadTranslations(lang);
     
     const environment = await client.environment.getEnvironment();
     user = environment.user;
     
     const isSidebarMenuVisible = await client.ux.isMenuSidebarVisible();
     if (!isTopLevelApplication()) {
         client.ux.startProgress();
     }
     
     client.ux.setForceAccountSiderBarDisplayOnLargeScreen(true);
     if (!isSidebarMenuVisible) {
         client.ux.showAccountSidebar();
     }

     //await client.tracking.setConfig(TRACKING);

     Constants.BILLING_REDIRECTIONS.forEach((redirectionRegex) => {
         const hash = window.location.hash.replace('#', '');
         if (redirectionRegex.test(hash)) {
             window.location.assign(
                 client.navigation.getURL(
                     environment.getApplicationURL('dedicated'),
                     window.location.hash,
                 ),
             );
         }
     });
     
     client.ux.hidePreloader();
     client.ux.stopProgress();
     isMounted = true;
 });

</script>

{#if isMounted}
    <h1>{$t('common.manager_hub_dashboard_welcome', { name: user.firstname })}</h1>
    <div class="mb-6">
        <Banner locale={$locale} />
    </div>
    <div class="w-full mb-4">
        <NotificationsBanner />
    </div>
    <div class="mt-4">
        <h2 class="my-4">{$t('common.manager_hub_dashboard_overview')}</h2>
        <div class="flex flex-col md:flex-row mb-8">
            <div class="md:w-2/3 md:mr-8 mb-4"><CardPaymentStatus /></div>
            <div class="md:w-1/3"><BillingSummary /></div>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-2/3 md:mr-8"><CardSupport /></div>
            <div class="md:w-1/3"><LastOrder /></div>
        </div>
    </div>
    <div class="mt-10">
        <DashboardServices />
    </div>
{/if}
