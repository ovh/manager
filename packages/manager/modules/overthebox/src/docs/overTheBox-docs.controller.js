import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ function ($translate, OVER_THE_BOX) {
  const self = this;

  function injectTitleInUrl(descriptor, lang) {
    if (descriptor.url && descriptor.url[lang]) {
      descriptor.url[lang] = descriptor.url[lang].replace('{title}', snakeCase($translate.instant(descriptor.label))); // eslint-disable-line
    }
    if (descriptor.subs) {
      forEach(descriptor.subs, (sub) => {
        injectTitleInUrl(sub, lang);
      });
    }
  }

  function init() {
    // Checking configuration (registered or from browser)
    if (localStorage['univers-selected-language']) {
      self.language = localStorage['univers-selected-language'].replace(/-.*$|_.*$/, '');
    } else if (navigator.language || navigator.userLanguage) {
      self.language = (navigator.language || navigator.userLanguage).replace(/-.*$|_.*$/, '');
    }
    self.docs = OVER_THE_BOX;
    injectTitleInUrl(self.docs, self.language);
  }

  init();
}
