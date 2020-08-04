import forEach from 'lodash/forEach';
import has from 'lodash/has';
import isString from 'lodash/isString';
import snakeCase from 'lodash/snakeCase';

import { Environment } from '@ovh-ux/manager-config';

export default class {
  /* @ngInject */
  constructor($translate, TucSmsMediator, TucToastError, SMS_GUIDES) {
    this.$translate = $translate;
    this.TucSmsMediator = TucSmsMediator;
    this.TucToastError = TucToastError;
    this.constant = { SMS_GUIDES };
  }

  $onInit() {
    this.loading = {
      init: false,
    };
    this.guides = null;
    this.language = null;
    this.count = null;

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise
      .then(() => {
        this.guides = this.constant.SMS_GUIDES;
        this.language = Environment.getUserLanguage();
        this.injectTitleInUrl();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Inject title in URL.
   */
  injectTitleInUrl() {
    if (has(this.guides, 'sections')) {
      forEach(this.guides.sections, (section) => {
        if (has(section, 'guides')) {
          forEach(section.guides, (guide) => {
            if (has(guide, ['url', this.language]) && isString(guide.label)) {
              // eslint-disable-next-line no-param-reassign
              guide.url[this.language] = guide.url[this.language].replace(
                '{title}',
                snakeCase(this.$translate.instant(guide.label)),
              );
              this.count += 1;
            }
          });
        }
      });
    }
  }

  /**
   * Has guides helper.
   * @return {Boolean}
   */
  hasGuides() {
    return this.count > 0;
  }
}
