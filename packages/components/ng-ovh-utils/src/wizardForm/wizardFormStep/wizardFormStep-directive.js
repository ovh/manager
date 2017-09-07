angular.module('ua.wizardForm').directive('wizardFormStep', function () {
    'use strict';
    return {
        restrict    : 'A',
        require     : '^wizardForm',
        transclude  : true,
        scope       : true,
        templateUrl : 'components/ovh-utils-angular/wizardForm/wizardFormStep/wizardFormStep.html',
        compile     : function () {
            return {
                pre : function ($scope, $elem, $attr, $wizardCtrl) {

                    $scope.stepShown = false;

                    $scope.onLoad = function () {
                        if ($attr.wizardFormStepOnLoad && angular.isFunction($scope[$attr.wizardFormStepOnLoad])) {
                            $scope[$attr.wizardFormStepOnLoad]();
                        }
                    };

                    // Check step valid
                    if ($attr.wizardFormStepValid) {
                        $scope.stepValid = !!$scope.$eval($attr.wizardFormStepValid);

                        $scope.$watch($attr.wizardFormStepValid, function (newValue) {
                            $scope.stepValid = newValue;
                            $wizardCtrl.checkStepShow();
                        }, true);

                    } else {
                        $scope.stepValid = true;
                    }

                    // onLoad when shown
                    if ($attr.wizardFormStepOnLoad && angular.isFunction($scope[$attr.wizardFormStepOnLoad])) {
                        $scope.$watch('stepShown', function (newValue, oldValue) {
                            if (oldValue === false && newValue === true || (oldValue === true && newValue === true && $scope.stepNumber === 1)) {
                                $scope.onLoad();
                            }
                        });
                    }

                    // Title
                    if ($attr.wizardFormStepTitle !== undefined) {
                        $scope.$watch($attr.wizardFormStepTitle, function (newText) {
                            $scope.stepTitle = newText;
                        });
                    }

                    // Title step number
                    if ($attr.wizardFormStepTitleCount) {
                        $scope.stepTitleCount = true;
                    } else {
                        $scope.stepTitleCount = false;
                    }

                    // Title step icon
                    if ($attr.wizardFormStepTitleIcon) {
                        $scope.stepTitleIcon = $scope.$eval($attr.wizardFormStepTitleIcon);
                    }

                    // Title check icons
                    if ($attr.wizardFormStepTitleCheck) {
                        $scope.stepTitleCheck = true;
                    } else {
                        $scope.stepTitleCheck = false;
                    }

                    // Hidden text
                    if ($attr.wizardFormStepHiddenText !== undefined) {
                        $scope.$watch($attr.wizardFormStepHiddenText, function (newText) {
                            $scope.stepHiddenText = newText;
                        });
                    } else {
                        $scope.stepHiddenText = $scope.tr('wizard_hidden_text');
                    }

                },
                post: function ($scope, $elem, $attr, $wizardCtrl) {

                    $scope.stepNumber = $wizardCtrl.getStepCount() + 1;

                    $wizardCtrl.addStep($scope);

                    $scope.loadStep = function () {
                        $scope.onLoad();
                    };

                }
            };
        }
    };
});
