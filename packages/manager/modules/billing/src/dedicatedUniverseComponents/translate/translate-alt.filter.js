/**
 * Provides an alternative if key to translate does not exists.
 * Example :
 *
 *   'my_key' | ducTranslateAlt: 'foo'
 *   will resolve to 'foo' if 'my_key' could not be translated
 *
 *   'my_key' | ducTranslateAlt: ('my_other_key' | translate)
 *   you can use any valid angular expression as alternative value
 */
export default /* @ngInject */ ($translate) => (toTranslate, alternative) => {
  const translated = $translate.instant(toTranslate);
  return translated === toTranslate ? alternative : translated;
};
