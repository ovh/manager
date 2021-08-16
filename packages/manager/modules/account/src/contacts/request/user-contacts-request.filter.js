export default /* @ngInject */ ($translate) => (toTranslate, alternative) => {
  const translated = $translate.instant(toTranslate);
  return translated === toTranslate ? alternative : translated;
};
