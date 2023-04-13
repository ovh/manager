<script lang="ts">
import { Badge, Status } from '$components/ui/index.ts';
 interface Action {
     url: string,
     label: string
 };
 
 export let title: string;
 export let count: number;
 export let action: Action;
 export let noHeader: boolean = false;
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

<div class="card">
    {#if noHeader === false}
        <div class="card-header flex flex-row">
            <h3 class="flex-1 mb-4">
                <span>{title}</span>
                <Badge status={Status.Info}>{count}</Badge>
            </h3>
            {#if action.url}
                <a href={action.url} role="button" class="ghost small icon" targt="_top">
                    <span class="float-left block invisible md:visible">{action.label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2 -mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                </a>
            {/if}
        </div>
    {/if}
    <slot />
</div>
