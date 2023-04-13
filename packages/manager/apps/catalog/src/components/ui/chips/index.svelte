<script lang="ts">
 import { Badge, Status, Size } from '$components/ui/index.ts';
 import { createEventDispatcher } from 'svelte';
 export let value;
 const dispatch = createEventDispatcher();
 const onClick = () => {
     dispatch('close', {
			   value,
		 });
 };
</script>

<Badge status={Status.Info} size={Size.Default}>
    <div class="flex flex-row justify-items-center items-center">
        <span>{value}</span>
        <button type="button" class="ghost hover:bg-transparent !bg-transparent"
                on:click={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</Badge>
