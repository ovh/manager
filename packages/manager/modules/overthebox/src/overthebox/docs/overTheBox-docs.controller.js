import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';

import { Environment } from '@ovh-ux/manager-config';

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
    this.language = Environment.getUserLanguage();
    this.docs = this.OVER_THE_BOX;
    this.injectTitleInUrl(this.docs, this.language);
  }
}
