<script lang="ts">
 import { ActionMenu, Skeleton, Style } from '$components/ui/index';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { t, locale } from '$lib/translations';

 const billingPeriods: array = [1, 3, 6];
 let currentPeriod: number = 1;

 let DEBT_PAY_URL: string;
 let BILLS_URL: string;
 
 const getFormattedPrice = (price, currency) => {
     return currency && price
          ? Intl.NumberFormat($locale?.replace('_', '-'), {
              style: 'currency',
              currency: currency,
              maximumSignificantdigits: 1,
          }).format(price)
          : '';
 };

 const fetchBills = async() => {
     
     const [ bills, debt, debtUrl ] = await Promise.all([
         fetch(`/engine/2api/hub/bills?billingPeriod=${currentPeriod}`),
         fetch(`/engine/2api/hub/debt`),
         $shellClient?.navigation?.getURL(
             'dedicated',
             '#/billing/history/debt/all/pay',
         ),
     ]);
     
     if (bills.ok && debt.ok) {
         const { data: b } = await bills.json();
         const { data: d } = await debt.json();
         DEBT_PAY_URL = await debtUrl;

         BILLS_URL = await $shellClient?.navigation?.getURL(
             'dedicated',
             '#/billing/history',
             {
                 filter: JSON.stringify(b.bills.data.period)
             }
         )

         return {
             bills: b.bills.data,
             debt: d.debt.data,
         };
     } 
 };

 const onChange = () => {
     billsPromise = fetchBills()
 };

 let billsPromise = fetchBills();
</script>

<style>
 .billing-summary {
     background-color: #4bb2f6;
     background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjc2IiBoZWlnaHQ9IjI4NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMkZCNUY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTU3RUVBIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCBpZD0iYSIgd2lkdGg9IjI3NiIgaGVpZ2h0PSIyODciIHg9IjAiIHk9IjAiIHJ4PSIwIi8+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PG1hc2sgaWQ9ImMiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2EiLz48L21hc2s+PHVzZSBmaWxsPSJ1cmwoI2IpIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDI4NykiIHhsaW5rOmhyZWY9IiNhIi8+PGcgb3BhY2l0eT0iLjI0NSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOnNjcmVlbiIgZmlsbD0iI0Q4RDhEOCIgbWFzaz0idXJsKCNjKSI+PHBhdGggZD0iTS01OCAxMzYuNzA0TDExMiAzN3YxOTd6IiBvcGFjaXR5PSIuNjgiLz48cGF0aCBkPSJNMTEyIDEzMy4wOEwxOTUgODV2OTV6IiBvcGFjaXR5PSIuMTg4Ii8+PHBhdGggZD0iTTE1NCA2Mi4zMjlMMTkyIDM5djQ0eiIgb3BhY2l0eT0iLjM4OSIvPjxwYXRoIGQ9Ik0xOTIgODYuMDhMMjc1IDM4djk1eiIgb3BhY2l0eT0iLjQxMyIvPjxwYXRoIGQ9Ik0zNTcgODYuMDhMMjc0IDM4djk1eiIgb3BhY2l0eT0iLjE1MSIvPjxwYXRoIGQ9Ik0yNzQgMTMyLjU2MUwzNTcgODZ2OTN6IiBvcGFjaXR5PSIuMzM5Ii8+PHBhdGggZD0iTTE5MiAxNzkuMDhMMjc1IDEzMXY5NXoiIG9wYWNpdHk9Ii43NyIvPjxwYXRoIGQ9Ik0xOTUgODYuMDhMMTEyIDM4djk1eiIgb3BhY2l0eT0iLjM5MiIvPjxwYXRoIGQ9Ik0xMTIgMjMxLjY1MUwtNTggMTM0djE5NnoiIG9wYWNpdHk9Ii4zNjkiLz48cGF0aCBkPSJNMTEyIDM3LjY1MUwtNTgtNjB2MTk2eiIgb3BhY2l0eT0iLjQ3NSIvPjwvZz48L2c+PC9zdmc+);
     background-repeat: no-repeat;
     background-size: cover;
     color: #fff;
     font-weight: 600;
     text-align: center;
     border-radius: .5rem;
     padding: 1rem 0;
     width: 100%;
 }
</style>

{#await billsPromise }
    <Skeleton style={Style.Card} />
{:then { bills, debt } }
    <div class="billing-summary flex flex-col">
        <h3 class="text-white mb-4">{$t('billing-summary.hub_billing_summary_title')}</h3>
        <div class="align-center h-8 mb-4">
            <select class="bg-transparent font-semibold color-white ring-2 ring-white rounded px-2 h-8"
                    bind:value={currentPeriod}
                    on:change={onChange}>
                {#each billingPeriods as billingPeriod}
                    <option value={billingPeriod} class="bg-transparent appearance-none">
                        {$t(`billing-summary.hub_billing_summary_period_${billingPeriod}`)}
                    </option>
                {/each}
            </select>
        </div>
        <div class="font-semibold text-7xl">{getFormattedPrice(bills.total, bills.currency.code)}</div>
        <div class="flex flex-row font-semibold my-4 justify-center">
            {#if bills.total > 0 && debt.dueAmount.value === 0}
                <div class="flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 align-middle">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="ml-2">{$t('billing-summary.hub_billing_summary_debt_null')}</span>
                </div>
            {/if}

            {#if debt.dueAmount.value > 0}
                <div>
                    <span>
                        {$t('billing-summary.hub_billing_summary_debt', { debt: getFormattedPrice(debt.dueAmount.value, debt.dueAmount.currencyCode)})}
                    </span>
                    <a
                        class="block"
                        href={ DEBT_PAY_URL }
                        target="_blank"
                        rel="noreferrer"
                    >
                        {$t('billing-summary.hub_billing_summary_debt_pay')}
                    </a>
                </div>
            {/if}

            {#if bills.total === 0}
                <p class="mt-3">{$t('billing-summary.hub_billing_summary_debt_no_bills')}</p>
            {/if}
        </div>
        <div class="mt-8">
            <a role="button" href={BILLS_URL} class="small icon" target="_top">
                {$t('billing-summary.hub_billing_summary_display_bills')}
                <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
        </div>
    </div>
{:catch error}
    <p>Error loading bills: {error.message}</p>
{/await}
