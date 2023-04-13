<script lang="ts">
 import CardServices from './card-services.svelte';
 import { t } from '$lib/translations';
 import { fade } from 'svelte/transition';
 
 let expand: boolean = false;
 
 const fetchServices = async () => {
     const res = await fetch(`/engine/2api/hub/services`)

     if (res.ok) {
         let services = await res.json();
         return services.data.services.data.data;
     }
 }

 const onClick = (e) => {
     expand = !expand;
 };
</script>

<h2 class="my-4">{$t('common.manager_hub_dashboard_services')}</h2>
{#await fetchServices()}
    <p>Loading fetchServices...</p>
{:then services}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each Object.entries(services) as [serviceType, value], i}
            {#if expand || i < 6}
                <div transition:fade>
                    <CardServices {serviceType}
                                  services={value.data}
                                  maxItems="4" />
                </div>
            {/if}
        {/each}
    </div>
    <div class="flex pt-4 items-center justify-center">
        <button type="button"
                class="text-primary-500 hover:bg-primary-100 py-2.5 text-center inline-flex items-center"
                on:click={onClick}>
            <span class="block float-left">{$t(!expand ? 'services.manager_hub_products_see_more' : 'services.manager_hub_products_see_less')}</span>
            {#if expand}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2 -mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2 -mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            {/if}
        </button>
    </div>    
{:catch error}
    <p>Error loading services: {error.message}</p>
{/await}
