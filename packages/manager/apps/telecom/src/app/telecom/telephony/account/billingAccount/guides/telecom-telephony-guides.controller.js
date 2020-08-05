import flatten from 'lodash/flatten';
import map from 'lodash/map';

import { Environment } from '@ovh-ux/manager-config';

angular.module('managerApp').controller(
  'TelecomTelephonyGuidesCtrl',
  class TelecomTelephonyGuidesCtrl {
    constructor(TELEPHONY_GUIDES) {
      this.constant = { TELEPHONY_GUIDES };
    }

    $onInit() {
      this.loading = {
        init: false,
      };
      this.guides = null;
      this.language = null;
      this.count = null;

      this.guides = this.constant.TELEPHONY_GUIDES;
      this.language = Environment.getUserLanguage();
      this.countGuides();
    }

    /**
     * Count guides.
     */
    countGuides() {
      this.count = flatten(
        map(this.guides.sections, (section) => section.guides),
      ).length;
    }

    /**
     * Has guides helper.
     * @return {Boolean}
     */
    hasGuides() {
      return this.count > 0;
    }
  },
);
