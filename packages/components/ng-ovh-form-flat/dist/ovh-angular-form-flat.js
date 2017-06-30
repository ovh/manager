angular.module("ovh-angular-form-flat", []);

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-checkbox
 * @restrict EA
 *
 * @description
 * <p>Checkbox for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-checkbox>
                <input name="foo"
                    id="foo"
                    data-ng-model="checkModel"
                    type="checkbox">
            </flat-checkbox>
            <label for="foo">
                    <strong>Check me</strong>
            </label>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatCheckbox", function () {
    "use strict";

    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<div class="flat-checkbox" ng-transclude></div>',
        link: function ($scope, element) {
            element.append(
                '<div class="flat-checkbox-off"></div>' +
                '<div class="flat-checkbox-on"></div>'
            );
        }
    };
});

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-input-container
 * @restrict EA
 *
 * @description
 * <p>Container for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <div flat-input-container>
                <div class="row">
                    <div class="col-xs-12">
                        <label class="control-label" for="myInputId">
                            My Input Label Example
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <input
                            id="myInputId"
                            name="myInputName"
                            class="form-control"
                            placeholder="My Input Label Example"
                            >
                    </div>
                </div>
            </div>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatInputContainer", function () {
    "use strict";

    var CSS_VALID = "flat-valid";
    var CSS_INVALID = "flat-invalid";
    var CSS_DIRTY = "flat-dirty";
    var CSS_HIDE = "flat-hide";
    var CSS_SHOW = "flat-show";
    var CSS_FOCUS = "flat-focus";
    var CSS_EMPTY = "flat-empty";

    return {
        restrict: "EA",
        scope: {},
        priority: 10,
        controller: function () {
            var elem;
            var inputs;
            var label;
            var items = {};

            this.setElem = function (_elem) {
                elem = _elem;
            };

            this.setLabel = function (_label) {
                label = _label;
            };

            this.setInputs = function (_inputs) {
                inputs = _inputs;
            };

            this.setItemValidity = function (_item, _isValid) {
                items[_item] = _isValid; // eslint-disable-line no-underscore-dangle
                this.checkValidity();
            };

            this.checkValidity = function () {

                var isValid = true;

                for (var key in items) {
                    if (!items[key]) {
                        isValid = false;
                        break;
                    }
                }

                if (elem) {
                    if (isValid) {
                        elem.removeClass(CSS_INVALID).addClass(CSS_VALID);
                    } else {
                        elem.removeClass(CSS_VALID).addClass(CSS_INVALID);
                    }
                }

            };

            this.setDirty = function (isDirty) {
                if (isDirty) {
                    elem.addClass(CSS_DIRTY);
                } else {
                    elem.removeClass(CSS_DIRTY);
                }
            };

            this.setEmpty = function (isEmpty) {
                if (isEmpty) {
                    elem.addClass(CSS_EMPTY);
                } else {
                    elem.removeClass(CSS_EMPTY);
                }
            };

            this.checkLabelVisibility = function (alwaysShow) {
                if (angular.isUndefined(alwaysShow)) {
                    alwaysShow = false; // eslint-disable-line no-param-reassign
                }

                if (label) {
                    if (inputs.val() === "" && alwaysShow === false) {
                        label.removeClass(CSS_SHOW).addClass(CSS_HIDE);
                    } else {
                        label.removeClass(CSS_HIDE).addClass(CSS_SHOW);
                    }
                }
            };
        },
        compile: function compile (element) {

            element.find("input, textarea").each(function () {
                if ($(this).parents(".input-group-btn").size() === 0) {
                    $(this).addClass("flat-item");
                }
            });

            element.find("select").each(function () {
                $(this).addClass("flat-select");
            });

            return {
                post: function postLink (scope, elem, iAttrs, ctrl) {
                    var label;

                    elem.find("label").each(function () {
                        if ($(this).parents(".input-group-btn").size() === 0) {
                            label = $(this);
                        }
                    });

                    var inputs = elem.find(".flat-item, .flat-select");

                    ctrl.setElem(elem);
                    ctrl.setInputs(inputs);

                    if (label) {
                        ctrl.setLabel(label);
                        label.addClass("flat-hide");
                    }

                    inputs.on({
                        focus: function () {
                            elem.addClass(CSS_FOCUS);
                        },
                        blur: function () {
                            elem.removeClass(CSS_FOCUS);
                        }
                    });
                }
            };
        }
    };
});

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-item
 * @restrict EA
 *
 * @description
 * <p>Item for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-item>
            </flat-item>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatItem", function () {
    "use strict";

    return {
        restrict: "C",
        require: ["^flatInputContainer", "ngModel"],
        link: function ($scope, elem, attrs, ctrls) {
            var containerCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            $scope.$watch(
                function () {
                    return ngModelCtrl.$dirty;
                },
                function (value) {
                    containerCtrl.setDirty(value);
                }
            );

            $scope.$watch(
                function () {
                    return ngModelCtrl.$valid;
                },
                function (value) {
                    containerCtrl.setItemValidity(ngModelCtrl.$name, value);
                }
            );

            $scope.$watch(
                function () {
                    return ngModelCtrl.$viewValue;
                },
                function (value) {
                    // Set the input to dirty when the viewValue change
                    if (value) {
                        ngModelCtrl.$setDirty(true);
                    }

                    // If viewValue is empty or undefined, we advertise parent controller
                    if (!value || value.length === 0) {
                        containerCtrl.setEmpty(true);
                    } else {
                        containerCtrl.setEmpty(false);
                    }
                    containerCtrl.checkLabelVisibility($scope.$eval(attrs.keepLabelWhenEmpty));
                    containerCtrl.checkValidity();
                }
            );

            containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
        }
    };
});

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-radio
 * @restrict EA
 *
 * @description
 * <p>Radio for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-radio>
            </flat-radio>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatRadio", function () {
    "use strict";

    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<div class="flat-radio" ng-transclude></div>',
        link: function ($scope, element) {
            element.append(
                '<div class="flat-radio-off"></div>' +
                '<div class="flat-radio-on"></div>'
            );
        }
    };
});

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-select
 * @restrict EA
 *
 * @description
 * <p>Select for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-select>
            </flat-select>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatSelect", function () {
    "use strict";

    var CSS_FOCUS = "flat-focus";

    return {
        restrict: "EA",
        require: ["^?flatInputContainer", "ngModel"],
        link: function ($scope, elem, attrs, ctrls) {
            var containerCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            elem.wrap('<div class="flat-select"></div>');

            elem.on({
                focus: function () {
                    elem.parent().addClass(CSS_FOCUS);
                },
                blur: function () {
                    elem.parent().removeClass(CSS_FOCUS);
                }
            });

            if (containerCtrl) {
                $scope.$watch(
                    function () {
                        return ngModelCtrl.$dirty;
                    },
                    function (value) {
                        containerCtrl.setDirty(value);
                    }
                );

                $scope.$watch(
                    function () {
                        return ngModelCtrl.$valid;
                    },
                    function (value) {
                        containerCtrl.setItemValidity(ngModelCtrl.$name, value);
                    }
                );

                $scope.$watch(
                    function () {
                        return ngModelCtrl.$viewValue;
                    },
                    function (value) {
                        if (value) {
                            ngModelCtrl.$setDirty(true);
                        }

                        // If viewValue is empty or undefined, we advertise parent controller
                        if (!value || value.length === 0) {
                            containerCtrl.setEmpty(true);
                        } else {
                            containerCtrl.setEmpty(false);
                        }

                        containerCtrl.checkLabelVisibility();
                        containerCtrl.checkValidity();
                    }
                );

                containerCtrl.setItemValidity(ngModelCtrl.$name, ngModelCtrl.$valid);
            }
        }
    };
});

/**
 * @ngdoc directive
 * @name ovh-angular-form-flat.directive:flat-switch
 * @restrict EA
 *
 * @description
 * <p>Switch for manager V6</p>
 * @example
   <example module="myApp">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <flat-switch>
            </flat-switch>
        </div>
   </file>
   <file name="script.js">
        angular.module("myApp", ["ovh-angular-form-flat"]);
        angular.module("myApp").controller("mainCtrl", function() {
        });
   </file>
   </example>
 */
angular.module("ovh-angular-form-flat").directive("flatSwitch", function () {
    "use strict";

    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<div class="flat-switch" ng-transclude></div>',
        link: function ($scope, element, attrs) {
            var disableText = attrs.flatSwitchDisableText || "";
            var enableText = attrs.flatSwitchEnableText || "";

            element.append(
                '<div class="flat-switch-container">' +
                    '<span class="flat-switch-disable-text">' + disableText + "</span>" +
                    '<span class="flat-switch-enable-text">' + enableText + "</span>" +
                "</div>" +
                '<div class="flat-switch-cursor"></div>'
            );
        }
    };
});
