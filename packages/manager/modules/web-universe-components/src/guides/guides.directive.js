import get from 'lodash/get';

import template from './guides.html';

export default /* @ngInject */ (WUC_GUIDES) => ({
  restrict: 'A',
  template,
  scope: {
    wucGuidesTitle: '=',
    wucGuidesList: '=',
    tr: '=',
  },

  controller: /* @ngInject */ ($scope, coreConfig) => {
    $scope.showGuidesStatus = [];
    $scope.showGuidesStatus[0] = false;
    $scope.wucGuidesListDocuments = [];

    $scope.toggleGuides = (index) => {
      $scope.showGuidesStatus[index] = !$scope.showGuidesStatus[index];

      for (let i = 0; i < $scope.showGuidesStatus.length; i += 1) {
        if (i !== index) {
          $scope.showGuidesStatus[i] = false;
        }
      }
    };

    const user = coreConfig.getUser();
    const ovhSubsidiary = get(user, 'ovhSubsidiary', 'FR');

    $scope.guideConfiguration = get(
      WUC_GUIDES,
      `${ovhSubsidiary}.${$scope.wucGuidesList}`,
      get(WUC_GUIDES, `FR.${$scope.wucGuidesList}`, []),
    );
  },
});
