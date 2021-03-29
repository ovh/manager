import angular from 'angular';
import animateScrollTo from 'animated-scroll-to';

import controller from './controller';
import template from './template.html';

export default /* @ngInject */ function ($timeout) {
  return {
    restrict: 'EA',
    template,
    scope: {
      ovhContracts: '=',
      agree: '=ovhContractsValidated',
    },
    controller,
    controllerAs: 'ContractsCtrl',
    bindToController: true,
    link($scope, $elm, $attr, ContractsCtrl) {
      ContractsCtrl.setFullText(
        $attr.fullText === 'true' || $attr.fullText === undefined,
      );

      $scope.scrollToContract = (index) => {
        const scrollToOptions = {
          element: $elm.find('.contracts-list')[0],
          offset: 0,
          horizontal: false,
        };
        animateScrollTo(
          document.getElementById(`contract-${index}`),
          scrollToOptions,
        );
      };

      $scope.init = () => {
        const initialContractsTopPosition = $elm
          .find('.contracts-list')
          .position().top;

        angular.element($elm.find('.contracts-list')[0]).bind('scroll', () => {
          let currentIndex;

          ContractsCtrl.ovhContracts.forEach((contract, index) => {
            if (
              $elm.find(`#contract-${index}`).position().top -
                initialContractsTopPosition <=
              0
            ) {
              currentIndex = index;
            }
          });
          $timeout(() => {
            ContractsCtrl.setCurrentIndex(currentIndex);

            if (
              $elm.find('.contracts-list .panel-group').height() ===
              $elm.find('.contracts-list').scrollTop()
            ) {
              ContractsCtrl.enable();
            } else {
              ContractsCtrl.disable();
            }
          });
        });
      };
    },
  };
}
