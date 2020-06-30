import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';

export default class OverTheBoxDocsCtrl {
  /* @ngInject */
  constructor($translate, OVER_THE_BOX) {
    this.$translate = $translate;
    this.OVER_THE_BOX = OVER_THE_BOX;
  }

  injectTitleInUrl(descriptor, lang) {
    if (descriptor.url && descriptor.url[lang]) {
      // eslint-disable-next-line no-param-reassign
      descriptor.url[lang] = descriptor.url[lang].replace(
        '{title}',
        snakeCase(this.$translate.instant(descriptor.label)),
      );
    }
    if (descriptor.subs) {
      forEach(descriptor.subs, (sub) => {
        this.injectTitleInUrl(sub, lang);
      });
    }
  }

  $onInit() {
    // Checking configuration (registered or from browser)
    if (localStorage['univers-selected-language']) {
      this.language = localStorage['univers-selected-language'].replace(
        /-.*$|_.*$/,
        '',
      );
    } else if (navigator.language || navigator.userLanguage) {
      this.language = (navigator.language || navigator.userLanguage).replace(
        /-.*$|_.*$/,
        '',
      );
    }
    this.docs = this.OVER_THE_BOX;
    this.injectTitleInUrl(this.docs, this.language);
  }
}
