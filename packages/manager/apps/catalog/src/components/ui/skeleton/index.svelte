<script lang="ts">
 import { Style } from './skeleton.type.ts';
 export let style: Style = Style.List;
 export let rows: number = 1;
</script>

{#if style === Style.List}
    <div role="status" class="w-full p-2 space-y-4 divide-y divide-gray-200 rounded shadow animate-pulse h-full">
        {#each Array.from({length: rows})  as _, i}
            <div class="flex items-center justify-between {i > 0 ? 'pt-4' : ''}">
                <div>
                    <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
            </div>
        {/each}
        <span class="sr-only">Loading...</span>
    </div>
{/if}

{#if style === Style.Card}
    <div role="status" class="p-4 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
        <div class="flex items-center justify-center h-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
            <svg class="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
        </div>
        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="flex items-center mt-4 space-x-3">
            <div>
                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
        </div>
        <span class="sr-only">Loading...</span>
    </div>
{/if}
