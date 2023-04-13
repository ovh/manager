<script lang="ts">
 import { ActionMenu, Card, Badge, Size, Status, Skeleton } from '$components/ui/index';
 import { t } from '$lib/translations';
 import { shellClient } from '$lib/stores/ShellClient.ts';

 const action = {
     url: '',
     label: $t('common.manager_hub_see_all')
 }

 let tickets: array = [];
 
 const fetchSupport = async() => {
     const res = await fetch(`/engine/2api/hub/support`)
     action.url = await $shellClient.navigation.getURL('dedicated', '#/ticket');
     
     if (res.ok) {
         let t = await res.json();
         tickets = t.data.support.data;
         return tickets;
     }
 };

 const getStateCategory = (ticket) => {
     switch (ticket.state) {
         case 'open':
             return Status.Success;
         case 'closed':
             return Status.Info;
         case 'unknown':
             return Status.Warning;
         default:
             return Status.Error;
     }
 }

 const getURL = async(ticket) => {
     return await $shellClient.navigation.getURL('dedicated', '#/support/tickets/:ticketId', {
         ticketId: ticket.ticketId
     });
 }
</script>

<style>
 .support__illustration {
     background-image: url(/support.png);
     background-repeat: no-repeat;
     height: 10rem;
     background-position: 50%;
 }
</style>

<Card title={$t('support.hub_support_title')} count={tickets.count} noHeader={tickets.count === 0}
      action={action}>
    {#await fetchSupport()}
        <Skeleton rows="4" />
    {:then tickets}
        {#if tickets.count === 0}
            <div class="support__illustration" aria-hidden="true"></div>
            <h4>{$t('support.hub_support_need_help')}</h4>
            <p class="my-2">{$t('support.hub_support_need_help_more')}</p>
            <a href="https://docs.ovh.com/fr/">{$t('support.hub_support_help')}</a>
        {:else}
            <div class="grid grid-cols-1 space-y-2 divide-y ">
                {#each tickets.data as ticket}
                    <div class="flex flex-row items-center justify-between w-full py-2">
                        <div class="md:w-1/4 flex-none font-semibold text-primary-800">{ticket.serviceName || $t('support.hub_support_account_management')}</div>
                        <div class="grow text-secondary text-ellipsis overflow-none">{ticket.subject}</div>
                        <div class="w-32 flex-none">
                            <Badge status={getStateCategory(ticket)} size={Size.Default}>{ticket.state}</Badge>
                        </div>
                        <div class="w-22 flex-none">
                            {#await getURL(ticket)}
                            {:then url}
                                <a href={url} target="_top">{$t('support.hub_support_read')}</a>
                            {:catch error}
                                
                            {/await}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {:catch error}
        <p>{$t('support.hub_support_error')}</p>
    {/await}
</Card>
