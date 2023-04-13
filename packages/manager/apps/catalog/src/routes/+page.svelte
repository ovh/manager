<script lang="ts">
 import type { PageData } from './$types';
 import { t } from '$lib/translations';
 import { Card } from '$components/ui/index';
 import Filters from '$components/filters/index.svelte';
 export let data: PageData;
 let catalog = data.catalog;

 const onFilter = (e) => {
     catalog = e.detail.catalog;
 }
</script>

<h1>{$t('common.manager_hub_catalog') }</h1>
<Filters catalog={data.catalog} on:filter={onFilter} />
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each catalog as item}
        <Card { item } />
    {/each}
</div>
