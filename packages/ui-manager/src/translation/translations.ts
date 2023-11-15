import { Locale } from '@ovhcloud/msc-utils';

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
      `../components/${componentName}/translations/Messages_${locale?.replace(
        '-',
        '_',
      )}.json`
    );
  } catch {
    throw new Error(`No translations found for locale ${locale}`);
  }
}

export default getTranslations;
