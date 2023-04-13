<script lang="ts">
 import { Badge, Size, Status, Skeleton, Style } from '$components/ui/index';
 import { t } from '$lib/translations';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 
 let ORDERS_URL: string;
 let ORDER_TRACKER_URL: string;
 
 const fetchLastOrder = async() => {
     const [lastOrder, orderUrl] = await Promise.all([
         fetch(`/engine/2api/hub/lastOrder`),
         $shellClient.navigation.getURL(
             'dedicated',
             '#/billing/orders',
         ),
     ]);

     ORDERS_URL = orderUrl;

     if (lastOrder.ok) {
         let order =  await lastOrder.json();
         
         ORDER_TRACKER_URL = await $shellClient.navigation.getURL(
             'dedicated',
             '#/billing/order/:orderId',
             {
                 orderId: order.data.lastOrder.data.orderId
             }
         );
         return order;
     }
 }
</script>

<style>
 .order-tracking {
     background-color: #85d9fd;
     color: #00185e;
     text-align: center;
     border-radius: .5rem;
     padding: 1rem;
 }
</style>

{#await fetchLastOrder()}
    <Skeleton style={Style.Card} />
{:then lastOrder}
    <div class="order-tracking flex flex-col">
        <h3 class="mb-4">{$t('order-tracking.hub_order_tracking_title')}</h3>
        <div class="mb-2">
            <Badge status={Status.Info}>
                <a href={ORDER_TRACKER_URL} target="_top">{lastOrder.data.lastOrder.data.orderId}</a>
            </Badge>
        </div>
        <div class="mb-4 flex flex-row justify-center">
            <strong class="mr-1">{new Date(lastOrder.data.lastOrder.data.date).toLocaleString()}</strong>
            <span>Your order is available</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        </div>
        <div>
            <a class="small icon" href={ORDERS_URL} role="button" target="_top">
                {$t('order-tracking.hub_order_tracking_see_all')}
                <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
        </div>
    </div>
{:catch error}
    <p>Error loading fetchLastOrder: {error.message}</p>
{/await}
