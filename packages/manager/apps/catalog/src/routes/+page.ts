import type { PageLoad } from './$types';
import { browser } from "$app/environment";
import { useShellClient } from '@ovh-ux/shell';

export const load = (async ({ fetch }) => {
    let contentLanguage: string = 'fr_FR';
    
    if (browser) {
        let client = await useShellClient('catalog');
        contentLanguage = await client.i18n.getLocale() || localStorage.getItem('univers-selected-language');
    }
    
    const res = await fetch(`/engine/2api/catalog`, {
        headers: {
            'Content-Language': contentLanguage
        }
    });

    if (res.ok) {
        let catalog = await res.json();
        return { catalog };
    }

    return {};
}) satisfies PageLoad;
