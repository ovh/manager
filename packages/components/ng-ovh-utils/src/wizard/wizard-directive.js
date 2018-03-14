/*
 * wizard directive
 */
angular.module('ua.wizard').directive('wizard',
['$timeout',
function ($timeout) {
    'use strict';
    return {
        restrict: 'A',
        controller : 'wizardCtrl',
        transclude: true,
        templateUrl : 'components/ovh-utils-angular/wizard/wizard.html',
        link: function ($scope, $elm, $attr, ctrl) {
            var interval = null, inputs = "", konami = "38384040373937396665";

            ctrl.setStepCount($elm.find('*[data-wizard-step], *[wizard-step]').length);

            $elm.find('*[data-wizard-step], *[wizard-step]').attr('data-wizard-step-count', '{{stepCount}}');

            function setFocus() {
                $timeout(function () {
                    $elm.find('.wizard-container').focus();
                }, 500);
            }

            setFocus();

            $scope.$on('wizard-stepChange', function () {
                setFocus();
            });

            /*
             *KeyBoardManaging
             */
            angular.element($elm).bind('keydown', function (evt) {
                if(!$scope.keydownDisabled) {
                    var i,
                        keyCode = evt.keyCode,
                        currentStepScope = $scope.steps[$scope.currentStep-1],
                        stepValid = currentStepScope.stepValid,
                        nodeName = evt.target.nodeName,
                        co = function (lor) {
                            var randomIdx = Math.floor(Math.random()* 16),
                                randomValue =  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][randomIdx];
                            lor += randomValue;
                            if (lor.length === 6 || lor === '') {
                                return '#' + lor;
                            } else {
                                return co(lor);
                            }
                        };

                    //konami buffer
                    inputs += keyCode;
                    if (inputs.length > konami.length) {
                        inputs = inputs.substr((inputs.length - konami.length));
                    }

                    // check keyboards event
                    // if konami is match
                    if (inputs === konami) {
                        //awesome animation
                        if (!interval) {
                            i = 0;
                            interval = setInterval(function () {

                                i += 5;
                                $('#currentAction').css('transform', 'rotateX(' + i + 'deg) rotateY(' + -i + 'deg) rotateZ(' + i +'deg)');

                                if (i >= 360) {

                                    $('#currentAction').css({
                                        'transform' : ''
                                    }).find('div.wizard-title-container').css({
                                        'background-color' : co('')
                                    });
                                    clearInterval(interval);
                                    interval = null;
                                    // go next step
                                    if (keyCode === 13 && nodeName !== 'TEXTAREA' && nodeName !== 'BUTTON' && stepValid) {
                                        $scope.$apply(function () {
                                            currentStepScope.nextStep();
                                        });
                                    }
                                }
                            }, 10);
                            // flush konami buffer
                            inputs = "";
                        }
                    // enter pressed
                    } else if (!$attr.wizardCancelValidReturnKey && keyCode === 13 && nodeName !== 'TEXTAREA' && nodeName !== 'BUTTON' && stepValid) {
                        // go next step
                        $scope.$apply(function () {
                            currentStepScope.nextStep();
                        });
                    // escape pressed
                    } else if (keyCode === 27) {
                        $scope.$apply(function () {
                            currentStepScope.onCancel();
                        });
                    }
                }
            });

            $scope.onCancel = $attr.wizardOnCancel && angular.isFunction($scope.$eval($attr.wizardOnCancel)) ? $scope.$eval($attr.wizardOnCancel) : angular.noop;

            $scope.onFinish = $attr.wizardOnFinish && angular.isFunction($scope.$eval($attr.wizardOnFinish)) ? $scope.$eval($attr.wizardOnFinish) : angular.noop;

            if ($attr.wizardTitle) {
                $scope.$watch($attr.wizardTitle, function (newTitle) {
                    ctrl.setTitle(newTitle);
                });
            }

            if ($attr.wizardTitleIcon) {
                $scope.$watch($attr.wizardTitleIcon, function (newTitle) {
                    ctrl.setTitleIcon(newTitle);
                });
            }

            if ($attr.wizardHideConfirmButton !== undefined) {
                $scope.$watch($attr.wizardHideConfirmButton, function (newBoolean) {
                    ctrl.setConfirmButton(!!newBoolean);
                });
            }

            if ($attr.wizardHideCancelButton !== undefined) {
                $scope.$watch($attr.wizardHideCancelButton, function (newBoolean) {
                    ctrl.setCancelButton(!newBoolean);
                });
            }

            if ($attr.wizardKeydownDisabled !== undefined) {
                ctrl.setKeydownDisabled();
            }

            if ($attr.wizardBreadCrumb !== undefined) {
                $scope.$watch($attr.wizardBreadCrumb, function (newBoolean) {
                    newBoolean = newBoolean === undefined ? true : newBoolean;
                    ctrl.setWizardBreadCrumb(newBoolean);
                });
            }

            if ($attr.wizardConfirmButtonText !== undefined) {
                $scope.$watch($attr.wizardConfirmButtonText, function (newText) {
                    ctrl.setWizardConfirmButtonText(newText);
                });
            }

            if ($attr.wizardCancelButtonText !== undefined) {
                $scope.$watch($attr.wizardCancelButtonText, function (newText) {
                    ctrl.setWizardCancelButtonText(newText);
                });
            }

            if ($attr.wizardPreviousButtonText !== undefined) {
                $scope.$watch($attr.wizardPreviousButtonText, function (newText) {
                    ctrl.setWizardPreviousButtonText(newText);
                });
            }

            if ($attr.wizardNextButtonText !== undefined) {
                $scope.$watch($attr.wizardNextButtonText, function (newText) {
                    ctrl.setWizardNextButtonText(newText);
                });
            }

            if ($attr.wizardHideCloseButton !== undefined) {
                $scope.$watch($attr.wizardHideCloseButton, function (newBoolean) {
                    ctrl.setWizardCloseButton(!newBoolean);
                });
            }

            if ($attr.wizardHidePreviousButton !== undefined) {
                $scope.$watch($attr.wizardHidePreviousButton, function (newBoolean) {
                    ctrl.setWizardPreviousButton(!newBoolean);
                });
            }
        }
    };
}]);
