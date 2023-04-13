<script lang="ts">
 import { fade } from 'svelte/transition';
 import { Skeleton } from '$components/ui/index';
 let currentNotification;
 let notifications: array = [];
 
 const fetchNotifications = async () => {
     const res = await fetch(`/engine/2api/hub/notifications`);
     if (res.ok) {
         const { data } = await res.json();
         notifications = data.notifications.data.filter(({ level }) => level === 'error');
         currentNotification = notifications[0];
         return currentNotification;
     }
 }

 const onClick = () => {
     let index = notifications.indexOf(currentNotification);
     currentNotification = notifications[index + 1];
     if (!currentNotification) {
         currentNotification = notifications[0];
     }
 };

 const onBulletClick = (i) => {
     currentNotification = notifications[i];
 };
</script>

{#await fetchNotifications()}
    <div class="py-4 rounded-md h-32 min-h-max text-error-500 font-semibold">
        <Skeleton rows="1" />
    </div>
{:then notification}
    {#if notifications.length > 0}
        <div class="flex flex-col py-4 px-8 rounded-md bg-error-100 h-18 min-h-max text-error-500 font-semibold">
            <div class="flex flex-row">
                <div class="flex-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <div class="mx-4 grow" transition:fade>
                    {@html currentNotification.description}
                </div>
                {#if notifications.length > 1}
                    <div class="flex-none">
                        <button type="button" class="text-primary-500 hover:bg-opacity-0 hover:font-bold p-0"
                                on:click="{onClick}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                {/if}
            </div>
            {#if notifications.length > 1}
                <div class="mx-auto">
                    {#each notifications as notif, i}
                        <button type="button"
                                class="text-primary-500 hover:bg-opacity-0 hover:font-bold p-0 w-2 h-2 rounded-full mr-2 { i === notifications.indexOf(currentNotification) ? 'bg-error-700' : 'bg-white'}"
                                on:click={ () => onBulletClick(i) }>
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
{:catch error}
    <p>Error loading notifications: {error.message}</p>
{/await}
