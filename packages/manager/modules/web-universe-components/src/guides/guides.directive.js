import get from 'lodash/get';

import template from './guides.html';

export default /* @ngInject */ (OvhApiMe, WUC_GUIDES) => ({
  restrict: 'A',
  template,
  scope: {
    wucGuidesTitle: '=',
    wucGuidesList: '=',
    tr: '=',
  },
  controller: [
    '$scope',
    ($scope) => {
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

      OvhApiMe.v6()
        .get()
        .$promise.then((user) => {
          const ovhSubsidiary = get(user, 'ovhSubsidiary', 'FR');

          $scope.guideConfiguration = get(
            WUC_GUIDES,
            `${ovhSubsidiary}.${$scope.wucGuidesList}`,
            get(WUC_GUIDES, `FR.${$scope.wucGuidesList}`, []),
          );
        });
    },
  ],
});
