angular.module('managerApp').run(
  /* @ngInject */ ($translate, amMoment) => {
    let lang = $translate.use();

    if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
      lang = lang.toLowerCase().replace('_', '-');
    } else {
      [lang] = lang.split('_');
    }

    return import(`script-loader!moment/locale/${lang}.js`).then(() => {
      moment.locale(lang);
      amMoment.changeLocale(lang);
    });
  },
);
