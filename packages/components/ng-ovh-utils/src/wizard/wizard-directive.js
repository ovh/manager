import angular from 'angular';

import wizardController from './wizard-controller';
import template from './wizard.html';

export default /* @ngInject */ function ($timeout) {
  return {
    restrict: 'A',
    controller: wizardController,
    transclude: true,
    template,
    link($scope, $elm, $attr, ctrl) {
      let interval = null;
      let inputs = '';
      const konami = '38384040373937396665';

      ctrl.setStepCount($elm.find('*[data-wizard-step], *[wizard-step]').length);

      $elm
        .find('*[data-wizard-step], *[wizard-step]')
        .attr('data-wizard-step-count', '{{stepCount}}');

      function setFocus() {
        $timeout(() => {
          $elm.find('.wizard-container').focus();
        }, 500);
      }

      setFocus();

      $scope.$on('wizard-stepChange', () => {
        setFocus();
      });

      // Redirect the focus to the first element when we leave the last element

      // var focusables = $elm.find('button, [href], input, select,
      // textarea, [tabindex]:not([tabindex="-1"])');
      // console.log(focusables);

      /*
             *KeyBoardManaging
             */
      angular.element($elm).bind('keydown', (evt) => {
        if (!$scope.keydownDisabled) {
          let i;

          const { keyCode } = evt;

          const currentStepScope = $scope.steps[$scope.currentStep - 1];

          const { stepValid } = currentStepScope;

          const { isContentEditable, nodeName } = evt.target;

          const co = function co(lorParams) {
            const randomIdx = Math.floor(Math.random() * 16);
            let lor = lorParams;

            const randomValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][
              randomIdx
            ];
            lor += randomValue;
            if (lor.length === 6 || lor === '') {
              return `#${lor}`;
            }
            return co(lor);
          };

          // konami buffer
          inputs += keyCode;
          if (inputs.length > konami.length) {
            inputs = inputs.substr(inputs.length - konami.length);
          }

          // check keyboards event
          // if konami is match
          if (inputs === konami) {
            // awesome animation
            if (!interval) {
              i = 0;
              interval = setInterval(() => {
                i += 5;
                $('#currentAction').css(
                  'transform',
                  `rotateX(${i}deg) rotateY(${-i}deg) rotateZ(${i}deg)`,
                );

                if (i >= 360) {
                  $('#currentAction')
                    .css({
                      transform: '',
                    })
                    .find('div.wizard-title-container')
                    .css({
                      'background-color': co(''),
                    });
                  clearInterval(interval);
                  interval = null;
                  // go next step
                  if (
                    keyCode === 13
                    && nodeName !== 'TEXTAREA'
                    && !isContentEditable
                    && nodeName !== 'BUTTON'
                    && stepValid
                  ) {
                    $scope.$apply(() => {
                      currentStepScope.nextStep();
                    });
                  }
                }
              }, 10);
              // flush konami buffer
              inputs = '';
            }
            // enter pressed
          } else if (
            !$attr.wizardCancelValidReturnKey
            && keyCode === 13
            && nodeName !== 'TEXTAREA'
            && !isContentEditable
            && nodeName !== 'BUTTON'
            && stepValid
          ) {
            // go next step
            $scope.$apply(() => {
              currentStepScope.nextStep();
            });
            // escape pressed
          } else if (keyCode === 27) {
            $scope.$apply(() => {
              currentStepScope.onCancel();
            });
          }
        }
      });

      $scope.onCancel = $attr.wizardOnCancel && angular.isFunction(
        $scope.$eval($attr.wizardOnCancel),
      )
        ? $scope.$eval($attr.wizardOnCancel)
        : angular.noop;

      $scope.onFinish = $attr.wizardOnFinish && angular.isFunction(
        $scope.$eval($attr.wizardOnFinish),
      )
        ? $scope.$eval($attr.wizardOnFinish)
        : angular.noop;

      if ($attr.wizardTitle) {
        $scope.$watch($attr.wizardTitle, (newTitle) => {
          ctrl.setTitle(newTitle);
        });
      }

      if ($attr.wizardTitleIcon) {
        $scope.$watch($attr.wizardTitleIcon, (newTitle) => {
          ctrl.setTitleIcon(newTitle);
        });
      }

      if ($attr.wizardHideConfirmButton !== undefined) {
        $scope.$watch($attr.wizardHideConfirmButton, (newBoolean) => {
          ctrl.setConfirmButton(!!newBoolean);
        });
      }

      if ($attr.wizardHideCancelButton !== undefined) {
        $scope.$watch($attr.wizardHideCancelButton, (newBoolean) => {
          ctrl.setCancelButton(!newBoolean);
        });
      }

      if ($attr.wizardKeydownDisabled !== undefined) {
        ctrl.setKeydownDisabled();
      }

      if ($attr.wizardBreadCrumb !== undefined) {
        $scope.$watch($attr.wizardBreadCrumb, (newBool) => {
          const newBoolean = newBool === undefined ? true : newBool;
          ctrl.setWizardBreadCrumb(newBoolean);
        });
      }

      if ($attr.wizardConfirmButtonText !== undefined) {
        $scope.$watch($attr.wizardConfirmButtonText, (newText) => {
          ctrl.setWizardConfirmButtonText(newText);
        });
      }

      if ($attr.wizardCancelButtonText !== undefined) {
        $scope.$watch($attr.wizardCancelButtonText, (newText) => {
          ctrl.setWizardCancelButtonText(newText);
        });
      }

      if ($attr.wizardPreviousButtonText !== undefined) {
        $scope.$watch($attr.wizardPreviousButtonText, (newText) => {
          ctrl.setWizardPreviousButtonText(newText);
        });
      }

      if ($attr.wizardNextButtonText !== undefined) {
        $scope.$watch($attr.wizardNextButtonText, (newText) => {
          ctrl.setWizardNextButtonText(newText);
        });
      }

      if ($attr.wizardHideCloseButton !== undefined) {
        $scope.$watch($attr.wizardHideCloseButton, (newBoolean) => {
          ctrl.setWizardCloseButton(!newBoolean);
        });
      }

      if ($attr.wizardHidePreviousButton !== undefined) {
        $scope.$watch($attr.wizardHidePreviousButton, (newBoolean) => {
          ctrl.setWizardPreviousButton(!newBoolean);
        });
      }
    },
  };
}
