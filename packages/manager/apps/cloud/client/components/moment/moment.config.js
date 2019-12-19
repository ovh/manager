
angular.module('managerApp').run((TranslateService, moment, amMoment) => {
  // Set the Moment locale
  const locale = TranslateService.getUserLocale(true);
  moment.locale(locale);
  amMoment.changeLocale(locale);
});
