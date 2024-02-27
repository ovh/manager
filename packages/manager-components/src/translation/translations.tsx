import { Locale } from '../utils/translation';

export type Translations = {
  see_more_label: string;
};

export async function getTranslations({
  locale,
  componentName,
}: {
  locale: Locale;
  componentName: string;
}): Promise<Translations> {
  try {
    return await import(
      `../public/translations/${componentName}/Messages_${locale?.replace(
        '-',
        '_',
      )}.json`
    );
  } catch {
    throw new Error(`No translations found for locale ${locale}`);
  }
}

export default getTranslations;
