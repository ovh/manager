import get from 'lodash/get';
import { Environment } from '@ovh-ux/manager-config';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor(constants) {
      this.constants = constants;
    }

    $onInit() {
      this.guides = this.constants.TOP_GUIDES;
      this.subsidiary = this.user.ovhSubsidiary;
      this.helpCenterURL = get(
        this.constants,
        `urls.${this.subsidiary}.support`,
      );
      this.allGuides = get(
        this.constants,
        `urls.${this.subsidiary}.guides.all`,
        this.constants.urls[Environment.getRegion()].guides.all,
      );
    }
  },
);
