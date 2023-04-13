<script lang="ts">
 import { t } from '$lib/translations';
 import { Badge, Status } from '$components/ui/index.ts';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import IlluPCI from '$images/illu_cloud.png';
 import IlluBM from '$images/illu_baremetal.png';
 import IlluWeb from '$images/illu_web.png';
 import IlluNetwork from '$images/illu_network.webp';
 export let item: any ;

 //@TODO: Remove when illustration will be handle by PIM
 const getIllustration = (universe) => {
     switch (universe) {
         case 'Public Cloud':
             return IlluPCI;
             break;
         case 'Bare Metal Cloud':
             return IlluBM;
             break;
         case 'Hébergements web & Domaines':
             return IlluWeb;
             break;
         case 'Network':
             return IlluNetwork;
             break;
         default:
             return IlluPCI;
     }
 };

 const trackMoreInfo = async() => {
     await $shellClient.tracking.trackClick(`manager_product_catalog::manager_product_cards::more_info::${item.name}`);
 }
 const trackOrder = async() => {
     await $shellClient.tracking.trackClick(`manager_product_catalog::manager_product_cards::order_cta::${item.name}`);
 }
</script>

<style>
 .card {
     @apply rounded-md;
     @apply m-0;
     @apply p-4;
     @apply bg-white;
     border: 0 solid #e6e6e6;
     box-shadow: 0 0 6px 0 rgba(0,14,156,.2);
 }
</style>

<div class="card grid grid-cols-1 gap-2 h-full">
    <div class="container hidden md:block">
        <img src={getIllustration(item.universe)} class="mx-auto w-48 h-36"
             alt="" />
    </div>
    <div>
        {$t('filters.manager_hub_catalog_category')}
        <Badge status={Status.Info}>
            {item.category}
        </Badge>
    </div>
    <div>
        <h2>{item.name}</h2>
    </div>
    <div class="my-2 text-secondary">{item.description}</div>
    <div class="mb-2">
        <a href={item.url} target="_top" class="flex flex-row items-center"
           on:click={trackMoreInfo}>
            {$t('common.manager_hub_catalog_know_more')}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
        </a>
    </div>
    <div class="my-4">
        <a role="button" href={item.order} class="small primary" target="_top"
           on:click={trackOrder}>
            {$t('common.manager_hub_catalog_order')}
        </a>
    </div>
</div>
