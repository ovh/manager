// convert language to date-fns locale
export default function getLocale(language: string) {
  if (language === 'en_GB') {
    return 'enGB';
  }
  if (language === 'fr_CA') {
    return 'frCA';
  }
  const [locale] = language.split('_');
  return locale;
}
