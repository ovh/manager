<script lang="ts">
 import { Card } from '$components/ui/index';
 import { t } from '$lib/translations';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { getProductListingRoute } from './constants.ts';

 export let serviceType: string = '';
 export let services: array = [];
 export let maxItems: number = 4;
 
 const action = {
     url: '',
     label: $t('common.manager_hub_see_all')
 };

 const { application, hash } = getProductListingRoute(serviceType);
 if (application && hash) {
     $shellClient.navigation.getURL(application, hash).then(url => {
         action.url = url;
     })     
 }
 
 
</script>

<style>
 ul li:nth-child(2) {
     opacity: .75;
 }
 ul li:nth-child(3) {
     opacity: .50;
 }
 ul li:nth-child(4) {
     opacity: .25;
 }

 ul a {
     @apply font-semibold;
 }
</style>

<Card title={$t(`services.manager_hub_products_${serviceType}`)} count={services.length} {action}>
    <ul>
        {#each services.slice(0, maxItems) as service, i}
            <li>
                <a href={service.url} target="_top">{service.resource.displayName}</a>
            </li>
        {/each}
</Card>
