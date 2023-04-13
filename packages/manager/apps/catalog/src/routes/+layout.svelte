<script lang="ts">
 import '../app.css';
 import { onMount } from 'svelte';
 import { TRACKING } from '$lib/at-internet.constant.ts';
 import { shellClient } from '$lib/stores/ShellClient.ts';
 import { useShellClient } from '@ovh-ux/shell';
 import { defineApplicationVersion } from '@ovh-ux/request-tagger';
 import { isTopLevelApplication } from '@ovh-ux/manager-config';
 import { t, loadTranslations } from '$lib/translations';
 let isMounted = false;
 
 onMount(async () => {
     
     let client = await useShellClient('catalog');
     $shellClient = client;

     const lang = await client.i18n.getLocale();
     await loadTranslations(lang.replace('_','-'));

     client.i18n.onLocaleChange(({locale}) => {
         window.top.location.reload();
     });
     
     //const environment = await client.environment.getEnvironment();
     //user = environment.user;
     
     //const isSidebarMenuVisible = await client.ux.isMenuSidebarVisible();
     //if (!isTopLevelApplication()) {
     client.ux.startProgress();
     //}
     
     //client.ux.setForceAccountSiderBarDisplayOnLargeScreen(true);
     //if (!isSidebarMenuVisible) {
     //client.ux.showAccountSidebar();
     //}

     await client.tracking.setConfig(TRACKING);
     
     client.ux.hidePreloader();
     client.ux.stopProgress();
     
     isMounted = true;
 });
</script>

{#if isMounted}
    <main class="container mx-auto md:pt-4 h-screen px-4">
        <slot />
    </main>
{/if}
