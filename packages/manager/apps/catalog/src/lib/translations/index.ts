import i18n from 'sveltekit-i18n';
import lang from './langs.json';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
    fallbackLocale: 'fr-FR',
    translations: {
        "de-DE": { lang },
        "en-GB": { lang },
        "es-ES": { lang },
        "fr-FR": { lang },
        "fr-CA": { lang },
        "it-IT": { lang },
        "pl-PL": { lang },
        "pt-PT": { lang },
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
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_de_DE.json')).default,
        },
        {
            locale: 'en-GB',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_en_GB.json')).default,
        },
        {
            locale: 'es-ES',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_es_ES.json')).default,
        },
        {
            locale: 'fr-CA',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_fr_CA.json')).default,
        },
        {
            locale: 'fr-FR',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_fr_FR.json')).default,
        },
        {
            locale: 'it-IT',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_it_IT.json')).default,
        },
        {
            locale: 'pl-PL',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_pl_PL.json')).default,
        },
        {
            locale: 'pt-PT',
            key: 'filters',
            loader: async () => (await import('$components/filters/translations/Messages_pt_PT.json')).default,
        },
    ],
};

export const { t, loading, locales, locale, loadTranslations } = new i18n(config);

//loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
