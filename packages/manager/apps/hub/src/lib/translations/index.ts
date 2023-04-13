import i18n from 'sveltekit-i18n';
import lang from './langs.json';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
    fallbackLocale: 'fr-FR',
    translations: {
        'de-DE': { lang },
        'en-GB': { lang },
        'es-ES': { lang },
        'fr-CA': { lang },
        'fr-FR': { lang },
        'it-IT': { lang },
        'pl-PL': { lang },
        'pt-PT': { lang },
    },
    loaders: [
        {
            locale: 'de-DE',
            key: 'common',
            loader: async () => (await import('$translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'common',
            loader: async () => (await import('$translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'common',
            loader: async () => (await import('$translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'common',
            loader: async () => (await import('$translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'common',
            loader: async () => (await import('$translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'common',
            loader: async () => (await import('$translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'common',
            loader: async () => (await import('$translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'common',
            loader: async () => (await import('$translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'billing-summary',
            loader: async () => (await import('$components/billing-summary/translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'notifications',
            loader: async () => (await import('$components/notifications/translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'order-tracking',
            loader: async () => (await import('$components/order-tracking/translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'payment-status',
            loader: async () => (await import('$components/payment-status/translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'services',
            loader: async () => (await import('$components/services/translations/Messages_pt_PT.json')).default,
        },
        {
            locale: 'de-DE',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'support',
            loader: async () => (await import('$components/support/translations/Messages_pt_PT.json')).default,
        },
    ],
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);

//loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
