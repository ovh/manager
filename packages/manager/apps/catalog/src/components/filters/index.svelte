<script lang="ts">
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { t } from '$lib/translations';
 import { fade, slide, fly } from "svelte/transition";
 import { quintOut } from 'svelte/easing';
 import { createEventDispatcher } from 'svelte';
 import { Chips } from '$components/ui/index.ts';

 const dispatch = createEventDispatcher();
 
 export let catalog;
 
 let expanded: boolean = false;
 let selectedUniverses: array = [];
 let selectedCategories: array = [];
 let selectedCustomerTypes: array = [];
 let selectedVendors: array = [];
 const universes: array = [...new Set(catalog.map(({universe}) => universe))];
 const categories: array = [...new Set(catalog.map(({category}) => category))];
 const customerTypes = [ 'Professional', 'Idividual'];
 const vendors = [ 'OVHcloud', 'Marketplace'];

 
 let filterCount: number = 0;
 let hasFilter: boolean = false;
 
 $: {
     filterCount = getCatalogFiltered().length;
     hasFilter = selectedUniverses.length || selectedCategories.length;
 }
 
 const onClick = async() => {
     expanded = !expanded;
     await $shellClient.tracking.trackClick(`manager_product_catalog::filter`);
 };

 const getCatalogFiltered = () => {
     let filteredCatalog = catalog;
     if (selectedUniverses.length > 0) {
         filteredCatalog = filteredCatalog.filter(({universe}) => selectedUniverses.indexOf(universe) !== -1);
     }
     
     if (selectedCategories.length > 0) {
         filteredCatalog = filteredCatalog.filter(({category}) => selectedCategories.indexOf(category) !== -1);
     }

     return filteredCatalog;
 }

 const applyFilters = async () => {
     dispatch('filter', {
			   catalog: getCatalogFiltered()
		 });

     expanded = false;
     await $shellClient.tracking.trackClick(`manager_product_catalog::filter::validate`);
 };

 const onChipsClosed = (e) => {
     selectedUniverses = selectedUniverses.filter(universe => universe !== e.detail.value);
     selectedCategories = selectedCategories.filter(category => category !== e.detail.value);
     applyFilters();
 };

 const onResetFilters = async () => {
     selectedUniverses = [];
     selectedCategories = [];
     applyFilters();
     await $shellClient.tracking.trackClick(`manager_product_catalog::reset_filters`);
 }

 let xTransition = 100;
 let yTransition = 0;
 const transitionInit = (el) => {
     if (el && window.matchMedia("(min-width: 768px)").matches) {
         xTransition = 0;
         yTransition = -20;
     }
 }
</script>

<button class="ghost fixed top-2 right-2 md:hidden" on:click={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
</button>

<div class="md:my-4">
    <div class="flex flex-col md:flex-row gap-1">
        <button class="ghost flex-row items-center hidden md:flex" on:click={onClick}>
            {$t('filters.manager_hub_catalog_filter')}
            {#if !expanded}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            {/if}
        </button>
        <div class="flex flex-col md:flex-row">
            {#each selectedUniverses as selectedUniverse}
                <div class="mt-2 md:mt-0">
                    <Chips value={selectedUniverse} on:close={onChipsClosed}></Chips>
                </div>
            {/each}
            {#each selectedCategories as selectedCategory}
                <div class="mt-2 md:mt-0">
                    <Chips value={selectedCategory} on:close={onChipsClosed}></Chips>
                </div>
            {/each}
        </div>
        <div>
            {#if hasFilter}
                <button class="ghost" on:click={onResetFilters}>
                    {$t('filters.manager_hub_catalog_reset')}
                </button>
            {/if}
        </div>
    </div>
    {#if expanded}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 md:pt-0 md:mt-4 px-4 md:px-0 h-screen top-0 right-0 fixed w-5/6 z-50 overflow-auto bg-white md:static md:h-auto md:w-full md:sticky"
             use:transitionInit
             transition:fly="{{duration: 300, x: xTransition, y: yTransition, easing: quintOut}}">
            <div class="flex flex-col">
                <p class="font-bold uppercase mb-2">{$t('filters.manager_hub_catalog_universe')}</p>
                {#each universes as universe}
                    <label class="flex flex-row items-center">
                        <input type="checkbox" class="small"
                               bind:group={selectedUniverses} name="universes" value={universe} />
                        <span class="ml-2">{universe}</span>
                    </label>
                {/each}
            </div>
            <div class="col-span-2">
                <p class="font-bold uppercase mb-2">{$t('filters.manager_hub_catalog_category')}</p>
                <div class="grid  md:grid-rows-6 md:grid-flow-col">
                    {#each categories as category}
                        <div>
                            <label class="flex flex-row items-center">
                                <input type="checkbox" class="small"
                                       bind:group={selectedCategories} name="categories" value={category} />
                                <span class="ml-2">{category}</span>
                            </label>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- 
            <div class="flex flex-col">
                <p class="font-bold uppercase mb-2">{$t('filters.manager_hub_catalog_customer_type')}</p>
                {#each customerTypes as customerType}
                    <label class="flex flex-row items-center">
                        <input type="checkbox" class="small"
                               bind:group={selectedCustomerTypes} name="customerTypes" value={customerType} />
                        <span class="ml-2">{customerType}</span>
                    </label>
                {/each}
            </div>

             <div class="flex flex-col">
                <p class="font-bold uppercase mb-2">{$t('filters.manager_hub_catalog_vendor')}</p>
                {#each vendors as vendor}
                    <label class="flex flex-row items-center">
                        <input type="checkbox" class="small"
                               bind:group={selectedVendors} name="vendors" value={vendor} />
                        <span class="ml-2">{vendor}</span>
                    </label>
                {/each}
             </div>
            -->
        </div>
        <div class="flex flex-row  mt-6 hidden md:flex">
            <div class="grow"></div>
            <div>
                <button on:click={onClick}>{$t('filters.manager_hub_catalog_cancel')}</button>
                <button class="primary ml-4" on:click={applyFilters}
                        disabled={filterCount <= 0}>
                    {$t('filters.manager_hub_catalog_apply')} {#if hasFilter}({filterCount}){/if}
                </button>
            </div>
        </div>
    {/if}
</div>

<div class="h-screen w-screen bg-primary-700 top-0 left-0 opacity-75 {expanded ? 'fixed md:hidden' : 'hidden'}" on:click={applyFilters} transition:fade></div>
