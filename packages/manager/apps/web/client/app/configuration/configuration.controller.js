import get from 'lodash/get';

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
        `urls.${this.user.ovhSubsidiary}.support`,
      );
    }
  },
);
