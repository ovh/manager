import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    constructor(constants, User) {
      this.constants = constants;
      this.User = User;
    }

    $onInit() {
      this.guides = this.constants.TOP_GUIDES;

      this.helpCenterURLs = omit(
        mapValues(this.constants.urls, 'support'),
        isUndefined,
      );

      return this.User.getUser()
        .then(({ ovhSubsidiary: subsidiary }) => {
          this.subsidiary = subsidiary;

          this.allGuides = get(
            this.constants,
            `urls.${subsidiary}.guides.all`,
            this.constants.urls.FR.guides.all,
          );
        })
        .catch(() => {
          this.allGuides = this.constants.urls.FR.guides.all;
        });
    }
  },
);
