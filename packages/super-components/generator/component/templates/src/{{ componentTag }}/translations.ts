import { Language } from '@ovhcloud/msc-utils';

export type Translations = {
  test: string;
  // TODO: Put your translation keys
};

/**
 * Import dynamically the right translation file
 */
export async function getTranslations(
  language?: Language,
): Promise<Translations> {
  try {
    switch (language) {
      // TODO: uncomment the other languages once generated
      // case 'de-DE':
      //   return await import('../translations/Messages_de_DE.json');
      // case 'en-GB':
      //   return await import('../translations/Messages_en_GB.json');
      // case 'es-ES':
      //   return await import('../translations/Messages_es_ES.json');
      // case 'fr-CA':
      //   return await import('../translations/Messages_fr_CA.json');
      case 'fr-FR':
        return await import('../translations/Messages_fr_FR.json');
      // case 'it-IT':
      //   return await import('../translations/Messages_it_IT.json');
      // case 'pl-PL':
      //   return await import('../translations/Messages_pl_PL.json');
      // case 'pt-PT':
      //   return await import('../translations/Messages_pt_PT.json');
      default:
        return await import('../translations/Messages_fr_FR.json');
    }
  } catch {
    throw new Error(`No translations found for language ${language}`);
  }
}

export default getTranslations;
