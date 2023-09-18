import { Locale } from '@ovhcloud/msc-utils';

export type Translations = {
  test: string;
  // TODO: Put your translation keys
};

/**
 * Import dynamically the right translation file
 */
export async function getTranslations(locale?: Locale): Promise<Translations> {
  try {
    // TODO: uncomment this structure once the other locales are generated
    // switch (locale) {
    //   case 'de-DE':
    //     return await import('../translations/Messages_de_DE.json');
    //   case 'en-GB':
    //     return await import('../translations/Messages_en_GB.json');
    //   case 'es-ES':
    //     return await import('../translations/Messages_es_ES.json');
    //   case 'fr-CA':
    //     return await import('../translations/Messages_fr_CA.json');
    //   case 'fr-FR':
    //     return await import('../translations/Messages_fr_FR.json');
    //   case 'it-IT':
    //     return await import('../translations/Messages_it_IT.json');
    //   case 'pl-PL':
    //     return await import('../translations/Messages_pl_PL.json');
    //   case 'pt-PT':
    //     return await import('../translations/Messages_pt_PT.json');
    //   default:
    //     return await import('../translations/Messages_fr_FR.json');
    // }
    return await import('../translations/Messages_fr_FR.json');
  } catch {
    throw new Error(`No translations found for locale ${locale}`);
  }
}

export default getTranslations;
