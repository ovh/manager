// Utility function to change the language from OVH to i18next format
export function ovhLocaleToI18next(language: string) {
  return language?.replace('-', '_') || '';
}
// Utility function to fetch the translation files to string
export async function fetchLocaleStringsForComponent(
  language: string,
): Promise<any> {
  return new Promise((resolve, reject): void => {
    fetch(`translations/Messages_${ovhLocaleToI18next(language)}.json`).then(
      (result) => {
        if (result.ok) {
          resolve(result.clone().json());
        } else reject();
      },
      () => reject(),
    );
  });
}
// Utility function to get translations with variables
export function getTranslation(
  localStrings: { [key: string]: string },
  key: string,
  options?: Record<string, string>,
): string {
  let translation = localStrings[key] || '';
  if (options) {
    Object.keys(options).forEach((option) => {
      const placeholder = `{{\\s*${option}\\s*}}`;
      translation = translation.replace(
        new RegExp(placeholder, 'g'),
        options[option],
      );
    });
  }
  return translation;
}
