import get from 'lodash/get';
import set from 'lodash/set';

angular.module('App').run(($q,
  $translate,
  ouiCalendarConfiguration,
  asyncLoader) => {
  // first be sure that common translation file is loaded...
  asyncLoader.addTranslations(import(`../../common/translations/Messages_${$translate.use()}.json`).then(x => x.default));

  // set ouiCalendar locale from the language setted to $translate
  // fallback to english if not setted
  set(ouiCalendarConfiguration, 'locale', get($translate.use().split('_'), '[0]', 'en'));
});
