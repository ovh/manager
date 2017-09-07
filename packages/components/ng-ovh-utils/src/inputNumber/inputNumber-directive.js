/**
 * @ngdoc directive
 * @name ovhDirectives.directive:inputNumber
 * @element A
 *
 * @decription
 * Input type="number" polyfill.
 * Compatible with HTML5 attributes "min", "max", and "step".
 * It can takes negatives and floating values.
 * User can increase/decrease value with "+" and "-" buttons, with keyboard arrows, or with the mouse wheel.
 * User can let the button down for increase/decrease value (with a little tempo and debounced), to avoid the "click click click ..." in the button :).
 * Put the attr "disabled" to the input will correctly disable buttons. Same for ng-hide and ng-show.
 * Style updated for Bootstrap.
 *
 * @version 1.0.0
 *
 * @example
 * <input type="number" data-ng-model="aaaa.bbbb" min="1" max="99" step="5" data-input-number />
 *
 * or, to force the utilisation:
 *
 * <input type="text" data-ng-model="aaaa.bbbb" min="1" max="99" step="5" data-input-number="text" />
 *
 *
 * @see HTML5 Number polyfill | Jonathan Stipe | https://github.com/jonstipe/number-polyfill
 */
angular.module('ua.inputNumber').directive('inputNumber',
['$http', '$compile', '$document',
function ($http, $compile, $document) {
    'use strict';
    return {
        restrict : 'A',
        require  : '?ngModel',
        link     : function ($scope, el, attrs, ngModel) {

            var i, getParams, clipValues, extractNumDecimalDigits, matchStep, increment, decrement, domMouseScrollHandler, mouseWheelHandler;

            i = document.createElement('input');
            i.setAttribute('type', 'number');

            if (attrs.inputNumber === 'text' || i.type === 'text') {

                getParams = function() {
                    var step = attrs.step,
                        min = attrs.min,
                        max = attrs.max,
                        val = parseFloat(el.val());
                    step = /^-?\d+(?:\.\d+)?$/.test(step) ? parseFloat(step) : null;
                    min = /^-?\d+(?:\.\d+)?$/.test(min) ? parseFloat(min) : null;
                    max = /^-?\d+(?:\.\d+)?$/.test(max) ? parseFloat(max) : null;
                    if (isNaN(val)) {
                        val = min || 0;
                    }
                    return {
                        min: min,
                        max: max,
                        step: step,
                        val: val
                    };
                };

                clipValues = function(value, min, max) {
                    if ((max != null) && value > max) {
                        return max;
                    } else if ((min != null) && value < min) {
                        return min;
                    } else {
                        return value;
                    }
                };

                extractNumDecimalDigits = function(input) {
                    if (input != null) {
                        var num = 0,
                            raisedNum = input;
                        while (raisedNum !== Math.round(raisedNum)) {
                            num += 1;
                            raisedNum = input * Math.pow(10, num);
                        }
                        return num;
                    } else {
                        return 0;
                    }
                };

                matchStep = function(value, min, max, step) {
                    var mod,
                        raiseTo,
                        raisedMod,
                        raisedStep,
                        raisedStepDown,
                        raisedStepUp,
                        raisedValue,
                        stepDown,
                        stepUp,
                        stepDecimalDigits = extractNumDecimalDigits(step);

                    if (step == null) {
                        return value;
                    } else if (stepDecimalDigits === 0) {
                        mod = (value - (min || 0)) % step;
                        if (mod === 0) {
                            return value;
                        } else {
                            stepDown = value - mod;
                            stepUp = stepDown + step;
                            if ((stepUp > max) || ((value - stepDown) < (stepUp - value))) {
                                return stepDown;
                            } else {
                                return stepUp;
                            }
                        }
                    } else {
                        raiseTo = Math.pow(10, stepDecimalDigits);
                        raisedStep = step * raiseTo;
                        raisedMod = (value - (min || 0)) * raiseTo % raisedStep;
                        if (raisedMod === 0) {
                            return value;
                        } else {
                            raisedValue = value * raiseTo;
                            raisedStepDown = raisedValue - raisedMod;
                            raisedStepUp = raisedStepDown + raisedStep;
                            if (((raisedStepUp / raiseTo) > max) || ((raisedValue - raisedStepDown) < (raisedStepUp - raisedValue))) {
                                return raisedStepDown / raiseTo;
                            } else {
                                return raisedStepUp / raiseTo;
                            }
                        }
                    }
                };

                increment = function() {
                    if (!el.is(":disabled")) {
                        var params = getParams(),
                            raiseTo = Math.pow(10, Math.max(extractNumDecimalDigits(params.val), extractNumDecimalDigits(params.step))),
                            newVal = (Math.round(params.val * raiseTo) + Math.round((params.step || 1) * raiseTo)) / raiseTo;

                        if ((params.max != null) && newVal > params.max) {
                            newVal = params.max;
                        }
                        newVal = matchStep(newVal, params.min, params.max, params.step);

                        $scope.$apply(function() {
                            ngModel.$setViewValue(newVal);
                        });
                    }
                };

                decrement = function() {
                    if (!el.is(":disabled")) {
                        var params = getParams(),
                            raiseTo = Math.pow(10, Math.max(extractNumDecimalDigits(params.val), extractNumDecimalDigits(params.step))),
                            newVal = (Math.round(params.val * raiseTo) - Math.round((params.step || 1) * raiseTo)) / raiseTo;

                        if ((params.min != null) && newVal < params.min) {
                            newVal = params.min;
                        }
                        newVal = matchStep(newVal, params.min, params.max, params.step);

                        $scope.$apply(function() {
                            ngModel.$setViewValue(newVal);
                        });
                    }
                };

                domMouseScrollHandler = function(e) {
                    e.preventDefault();
                    if (e.originalEvent.detail < 0) {
                        increment();
                    } else {
                        decrement();
                    }
                };

                mouseWheelHandler = function(e) {
                    e.preventDefault();
                    if (e.originalEvent.wheelDelta > 0) {
                        increment();
                    } else {
                        decrement();
                    }
                };


                /*==========  INIT  ==========*/

                $http.get('components/ovh-utils-angular/inputNumber/inputNumber.html').then(function (template) {

                    var $template = $compile(template.data)($scope),
                        $upBtn = $template.find('.input-number-btn-up'),
                        $downBtn = $template.find('.input-number-btn-down');

                    el.after($template);

                    $scope.$watch(attrs.ngModel, function (nV) {
                        el.val(nV);
                    });

                    if (angular.isDefined(attrs.ngHide)) {
                        $scope.$watch(attrs.ngHide, function (nV) {
                            if ($scope.$eval(nV)) {
                                $template.hide();
                            } else {
                                $template.show();
                            }
                        });
                    }

                    if (angular.isDefined(attrs.ngShow)) {
                        $scope.$watch(attrs.ngShow, function (nV) {
                            if ($scope.$eval(nV)) {
                                $template.show();
                            } else {
                                $template.hide();
                            }
                        });
                    }

                    el.bind({
                        focus: function() {
                            el.bind({
                                DOMMouseScroll: domMouseScrollHandler,
                                mousewheel: mouseWheelHandler
                            });
                        },
                        blur: function() {
                            el.unbind({
                                DOMMouseScroll: domMouseScrollHandler,
                                mousewheel: mouseWheelHandler
                            });
                        },
                        keypress: function(e) {
                            var _ref, _ref1;
                            if (e.keyCode === 38) {
                                increment();
                            } else if (e.keyCode === 40) {
                                decrement();
                            } else if (((_ref = e.keyCode) !== 8 && _ref !== 9 && _ref !== 35 && _ref !== 36 && _ref !== 37 && _ref !== 39) && ((_ref1 = e.which) !== 45 && _ref1 !== 46 && _ref1 !== 48 && _ref1 !== 49 && _ref1 !== 50 && _ref1 !== 51 && _ref1 !== 52 && _ref1 !== 53 && _ref1 !== 54 && _ref1 !== 55 && _ref1 !== 56 && _ref1 !== 57)) {
                                e.preventDefault();
                            }
                        },
                        change: function(e) {
                            if (e.originalEvent != null) {
                                var params = getParams(),
                                    newVal = clipValues(params.val, params.min, params.max);
                                newVal = matchStep(newVal, params.min, params.max, params.step, params.stepDecimal);

                                $scope.$apply(function() {
                                    ngModel.$setViewValue(newVal);
                                });
                            }
                        }
                    });

                    $upBtn.bind('mousedown', function() {
                        var releaseFunc, timeoutFunc;
                        increment();
                        timeoutFunc = function(incFunc) {
                            incFunc();
                            el.data('timeoutID', window.setTimeout(timeoutFunc, 10, incFunc));
                        };
                        releaseFunc = function() {
                            window.clearTimeout(el.data('timeoutID'));
                            $document.unbind('mouseup', releaseFunc);
                            $upBtn.unbind('mouseleave', releaseFunc);
                        };
                        $document.bind('mouseup', releaseFunc);
                        $upBtn.bind('mouseleave', releaseFunc);
                        el.data('timeoutID', window.setTimeout(timeoutFunc, 700, increment));
                    });

                    $downBtn.bind('mousedown', function() {
                        var releaseFunc, timeoutFunc;
                        decrement();
                        timeoutFunc = function(decFunc) {
                            decFunc();
                            el.data('timeoutID', window.setTimeout(timeoutFunc, 10, decFunc));
                        };
                        releaseFunc = function() {
                            window.clearTimeout(el.data('timeoutID'));
                            $document.unbind('mouseup', releaseFunc);
                            $downBtn.unbind('mouseleave', releaseFunc);
                        };
                        $document.bind('mouseup', releaseFunc);
                        $downBtn.bind('mouseleave', releaseFunc);
                        el.data('timeoutID', window.setTimeout(timeoutFunc, 700, decrement));
                    });

                })["catch"](function () {
                    throw 'Error template u-a inputNumber';
                });

            }
        }
    };
}]);
