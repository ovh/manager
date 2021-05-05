import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';

export default class OverTheBoxDocsCtrl {
  /* @ngInject */
  constructor($translate, coreConfig, OVER_THE_BOX) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
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
    this.language = this.coreConfig.getUserLanguage();
    this.docs = this.OVER_THE_BOX;
    this.injectTitleInUrl(this.docs, this.language);
  }
}
