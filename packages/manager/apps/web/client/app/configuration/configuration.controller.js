import get from 'lodash/get';
import { OVH_WEB_OFFERS_2024 } from './configuration.constants';

angular.module('App').controller(
  'configurationCtrl',
  class ConfigurationCtrl {
    /* @ngInject */
    constructor($scope, atInternet, coreConfig, constants) {
      this.constants = constants;
      $scope.user = coreConfig.getUser();
      this.atInternet = atInternet;
      this.banner2024 =
        OVH_WEB_OFFERS_2024[$scope.user.ovhSubsidiary] ||
        OVH_WEB_OFFERS_2024.DEFAULT;
    }

    trackClickWebOfferBanner() {
      this.atInternet.trackClick({
        name: 'web::::::banner::link::go-to-special-offers',
        type: 'action',
      });
    }

    $onInit() {
      this.guides = this.constants.TOP_GUIDES;
      this.subsidiary = this.user.ovhSubsidiary;
      this.helpCenterURL = get(
        this.constants,
        `urls.${this.subsidiary}.support`,
      );

      const guideURL = get(
        this.constants,
        `urls.${this.subsidiary}.guides.all`,
      );
      this.allGuides = guideURL || this.constants.urls.FR.guides.all;
    }
  },
);
