/**
 * @ngdoc directive
 * @name ovhDirectives.directive:dateTimePicker
 * @element ANY
 * @requires ?ngModel
 * @requires Tarruda's bootstrap-datetimepicker (JS and CSS)
 * @requires Moment
 *
 * @decription
 * Provide a date time picker, with 3 activable modes (date, datetime, time).
 *
 * @version 1.0.2
 *
 * @example
 * <code:html>
 *
 *  <div data-ng-controller="testCtrl">
 *
 *      <a href="#" class="btn small" id="test"
 *          data-dtp-placement="bottom"
 *          data-dtp-autoclose="true"
 *          data-ng-model="d.value"                     <!-- Caution: will be validated with the format -->
 *          data-dtp-format="DD/MM/YYYY HH:mm:ss"       <!-- Follow Moment rules -->
 *          data-dtp-type="date"                        <!-- ngModel var type (date by default). If set to "string", it follows the format -->
 *          data-dtp-model-timezone=""                  <!-- By default, the model is in UTC. Set this if you want to force a specific timezone (can be: "local", or a number) -->
 *          data-dtp-min-view-mode="months"
 *          data-dtp-pick-date="true"                   <!-- true by default -->
 *          data-dtp-pick-time="true"                   <!-- true by default -->
 *          data-dtp-pick-seconds="true"                <!-- true by default -->
 *          data-date-time-picker>
 *
 *          <span class="add-on">
 *              <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
 *          </span>
 *
 *          <input type="hidden"> <!-- or --> <input type="text">
 *
 *      </a>
 *
 *      <!-- Optional -->
 *      <button class="btn" data-toggle="datetimepicker">Toggle datetimepicker</button>
 *
 *  </div>
 *
 * </code>
 */
angular.module('ua.dateTimePicker').directive('dateTimePicker', ['translator', 'ovhDirectives.constant.dateTimePicker.CONFIG_OPTIONS', 'ovhDirectives.constant.dateTimePicker.VIEW_MODE', '$parse', '$window', function(translator, config, viewMode, $parse, $window) {
    'use strict';

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getLanguage
     * @returns {string} Language
     *
     * @description
     * Get the local language (auto get local).
     */
    function getLanguage() {
        var language;
        try  {
            language = translator.getLanguage().split('_')[0];
        } catch (e) {
            language = 'en';
        }

        return language;
    }

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getPosition
     * @param {node} element The DOM element.
     * @returns {object} Position of the element
     *
     * @description
     * Return the position of an element.
     */
    function getPosition(element) {
        var el = element[0];

        if ($('#modal-container').has(el).length) {
            // Inside a modal
            return $.extend({}, angular.isFunction(el.getBoundingClientRect) ? el.getBoundingClientRect() : {
                width  : el.offsetWidth,
                height : el.offsetHeight
            }, {
                top  : element.offset().top - $(window).scrollTop(),
                left : element.offset().left - $(window).scrollLeft()
            });
        } else {
            return {
                width  : el.offsetWidth,
                height : el.offsetHeight,
                top    : element.offset().top,
                left   : element.offset().left
            };
        }
    }

    /**
     * @doc method
     * @methodOf ovhDirectives.directive:dateTimePicker
     * @name ovhDirectives.directive:dateTimePicker#getConvertedFormatForDP
     * @param  {string} format Moment format
     * @return {string} Converted format.
     *
     * @description
     * Convert the format for the datetimepicker.
     * e.g.: moment="DD/MM/YYYY HH:mm:ss" ; datetimepicker need: "dd/MM/yyyy hh:mm:ss"
     */
    function getConvertedFormatForDP(format) {
        // @todo remove special formatting tokens who are not supported by the DP plugin.
        return format.replace('DD', 'dd').replace('YYYY', 'yyyy').replace('YY', 'yy').replace('HH', 'hh');
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function postLink(scope, element, attrs, controller) {

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#getOptions
             * @returns {object} The options
             *
             * @description
             * Sets the directive's options, using the datas of the element.
             */
            function getOptions() {
                var opt = {},
                    prefixedKey = '';

                angular.forEach(config, function(key) {
                    // Map options to prefixed attributes
                    prefixedKey = 'dtp' + (key.charAt(0).toUpperCase() + key.slice(1));
                    if(angular.isDefined(attrs[prefixedKey])) {
                        switch (key) {
                        case 'minViewMode':
                        case 'startView':
                            opt[key] = viewMode[attrs[prefixedKey]];
                            break;
                        case 'autoclose':
                        case 'pickDate':
                        case 'pickTime':
                        case 'pick12HourFormat':
                        case 'pickSeconds':
                            opt[key] = $parse(attrs[prefixedKey])(scope);
                            break;
                        case 'startDate':
                        case 'endDate':
                            // @todo temporary patch
                            opt[key] = new Date(attrs[prefixedKey]);
                            break;
                        case 'modelTimezone':
                            opt[key] = (attrs[prefixedKey] !== 'local' && attrs[prefixedKey] !== '' ? +attrs[prefixedKey] : attrs[prefixedKey]);
                            break;
                        default:
                            opt[key] = attrs[prefixedKey];
                        }
                    }
                    // Set default value
                    if (!opt.placement) {
                        opt.placement = 'bottom';
                    }
                });
                return opt;
            }

            var options = getOptions(),
                isAppleTouch = /(iP(a|o)d|iPhone)/g.test(navigator.userAgent) && !options.pickTime,   // @todo temporary patch (enable only for date)
                type = options.type || 'date',
                language = options.language || getLanguage(),
                readFormat = options.format || 'DD/MM/YYYY HH:mm:ss',
                format = isAppleTouch ? 'yyyy-mm-dd' : readFormat,
                formatDP = getConvertedFormatForDP(format),
                dtpData,
                dtpPopover;

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#init
             *
             * @description
             * Initialize the directive.
             */
            function init() {
                // Create datetimepicker
                element.datetimepicker(angular.extend(options, {
                    format: formatDP,
                    language: language
                }));

                dtpData = element.data('datetimepicker');
                dtpPopover = $(dtpData.widget[0]);

                // Because datetimepicker is buggy.
                if (options.minViewMode || options.startView) {
                    dtpData.startViewMode = dtpData.viewMode = options.minViewMode || options.startView;
                    dtpData.showMode();
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#destroy
             *
             * @description
             * Destroy the directive.
             */
            function destroy() {
                dtpData.destroy();
                angular.element($window).unbind('resize', windowResize);
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#windowResize
             *
             * @description
             * Adjust the position on window resize.
             */
            function windowResize() {
                if (dtpPopover.is(':visible')) {
                    var to = $window.setTimeout(function () {
                        managePlacement();
                        $window.clearTimeout(to);
                    }, 50);
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#toggleVisibility
             * @param {string} (optional) Force set of the dtp state.
             *
             * @description
             * Show/Hide (toggle) the datetimepicker dropdown.
             */
            function toggleVisibility(state) {
                if ((state && state === 'hide') || dtpPopover.is(':visible')) {
                    element.datetimepicker('hide');
                } else if ((state && state === 'show') || !!options.placement) {
                    element.datetimepicker('show');
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#managePlacement
             *
             * @description
             * Manage the placement, to simulate a popover.
             */
            function managePlacement() {
                var pickerWidth = dtpPopover.outerWidth(),
                    pickerHeight = dtpPopover.outerHeight(),
                    elemPos = getPosition(element),
                    windowWidth = $($window).width(),
                    placement = options.placement;

                dtpPopover.addClass(placement);
                dtpPopover.css({
                    "z-index": 10000
                });

                if (!dtpData.isInline) {
                    switch (placement) {
                    case 'bottom':
                        // If the datetimepicker overflow, pull it right.
                        if (windowWidth < elemPos.left + pickerWidth) {
                            dtpPopover.css({
                                top: elemPos.top + elemPos.height + 10,
                                left: 'auto',
                                right: windowWidth - elemPos.left - element[0].offsetWidth
                            });
                            dtpPopover.addClass('pull-right');
                        } else {
                            dtpPopover.css({
                                top: elemPos.top + elemPos.height + 10,
                                left: elemPos.left + elemPos.width / 2 - pickerWidth / 2,
                                right: 'auto'
                            });
                            dtpPopover.removeClass('pull-right');
                        }
                        break;
                    case 'top':
                        dtpPopover.css({
                            top : elemPos.top - pickerHeight,
                            left: elemPos.left + elemPos.width / 2 - pickerWidth / 2
                        });
                        break;
                    case 'left':
                        dtpPopover.css({
                            top : elemPos.top + elemPos.height / 2 - pickerHeight / 2,
                            left: elemPos.left - pickerWidth
                        });
                        break;
                    case 'right':
                        dtpPopover.css({
                            top : elemPos.top + elemPos.height / 2 - pickerHeight / 2,
                            left: elemPos.left + elemPos.width
                        });
                        break;
                    }
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#getDateString
             * @param  {string or date} date Date to format
             * @return {string} The date string
             *
             * @description
             * Convert date (date or string) into string.
             */
            function getDateString(date) {
                if (angular.isString(date)) {
                    return $window.moment(date, format).isValid() ? date : null;
                }
                return $window.moment(date).locale(language).format(format);
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#initController
             *
             * @description
             * Initialize Angular controller.
             */
            function initController() {
                // Handle date validity according to dateFormat
                if(controller) {

                    // modelValue -> $formatters -> viewValue
                    controller.$formatters.unshift(function(modelValue) {
                        return (options.type === 'date' ? new Date(modelValue) : getDateString(modelValue));
                    });

                    // viewValue -> $parsers -> modelValue
                    controller.$parsers.unshift(function(viewValue) {
                        if(!viewValue) {
                            controller.$setValidity('date', true);
                            return null;
                        } else if(angular.isDate(viewValue) && type === 'date') {
                            controller.$setValidity('date', true);
                            return viewValue;
                        } else if(angular.isDate(viewValue) && type === 'string') {
                            controller.$setValidity('date', true);
                            return getDateString(viewValue);
                        } else if(angular.isString(viewValue) && $window.moment(viewValue, format).isValid()) {
                            controller.$setValidity('date', true);
                            if(isAppleTouch) {
                                return new Date(window.moment(viewValue, format));
                            }
                            return type === 'string' ? getDateString(viewValue) : new Date($window.moment(viewValue, format));
                        } else {
                            controller.$setValidity('date', false);
                            return undefined;
                        }
                    });

                    // ngModel rendering
                    controller.$render = function ngModelRender() {
                        var date = null;
                        if(isAppleTouch) {
                            // @todo to modify
                            date = controller.$viewValue ? $.fn.datetimepicker.DPGlobal.formatDate(controller.$viewValue, $.fn.datetimepicker.DPGlobal.parseFormat(format), language) : '';
                            element.val(date);
                            return date;
                        }
                        if(controller.$viewValue && angular.isString(controller.$viewValue)) {
                            date = getDateString(controller.$viewValue);
                            if (!date) {
                                throw "viewValue format is incorrect!";
                            }
                            date = new Date($window.moment(date, format));
                        } else if(controller.$viewValue && angular.isDate(controller.$viewValue)) {
                            date = controller.$viewValue;
                        }

                        return dtpData.setLocalDate(date);
                    };
                }
            }

            /**
             * @doc method
             * @methodOf ovhDirectives.directive:dateTimePicker
             * @name ovhDirectives.directive:dateTimePicker#defineBehaviors
             *
             * @description
             * Define directive's behaviors.
             */
            function defineBehaviors() {
                // If we have a ngModelController then wire it up
                if(controller) {

                    element.on('show', function() {
                        managePlacement();
                    });

                    element.on('hide', function() {
                        // we need to check onClose if value is correct.
                        var dtpSelectedDate = dtpData.getDate();
                        if ( (options.startDate && dtpSelectedDate < options.startDate) || (options.endDate && dtpSelectedDate > options.endDate) ) {
                            dtpData.setLocalDate(controller.$viewValue);
                        }
                    });

                    // Element's childrens visibility toggle.
                    element.on('focus', 'input', function() {
                        toggleVisibility();
                    });
                    element.on('mousedown', '> :not(input):not(.add-on)', function(e) {
                        e.stopPropagation();
                        toggleVisibility();
                    });

                    // Support add-on.
                    var component = element.siblings('[data-toggle="datetimepicker"]');
                    if(component.length) {
                        component.on('mousedown', function(e) {
                            e.stopPropagation();
                            toggleVisibility();
                        });
                    }

                    // Update the view value on change date.
                    element.on('changeDate', function(e) {
                        if (!(options.minViewMode && dtpData.viewMode !== options.minViewMode)) {

                            scope.$apply(function () {
                                controller.$setViewValue(type === 'string' ? getDateString((options.modelTimezone ? e.localDate : e.date)) : (options.modelTimezone ? e.localDate : e.date));
                                if (options.autoclose && options.pickTime === false) {
                                    toggleVisibility('hide');
                                }
                            });
                        }
                    });

                    // [ISSUE]
                    // There are currently a bug with datetimepicker plugin. This is a temporary patch.
                    dtpPopover.find('th').on('click', function() {
                        var $table = $(this).parents('table');
                        setTimeout(function() {
                            // Previous
                            if ($table.find('tbody span:first-child').hasClass('disabled')) {
                                $table.find('th.prev').addClass('disabled');
                            } else {
                                $table.find('th.prev').removeClass('disabled');
                            }
                            // Next
                            if ($table.find('tbody span:last-child').hasClass('disabled')) {
                                $table.find('th.next').addClass('disabled');
                            } else {
                                $table.find('th.next').removeClass('disabled');
                            }
                        }, 99);
                    });

                    // Adjust the position on window resize.
                    angular.element($window).bind('resize', windowResize);

                    // Garbage collection.
                    scope.$on('$destroy', destroy);

                    // Update start-date when changed.
                    attrs.$observe('dtpStartDate', function(value) {
                        if (!!value) {
                            // @todo parse with Moment
                            options.startDate = new Date(value);
                            element.datetimepicker('setStartDate', options.startDate);
                        }
                    });

                    // Update end-date when changed.
                    attrs.$observe('dtpEndDate', function(value) {
                        if (!!value) {
                            // @todo parse with Moment
                            options.endDate = new Date(value);
                            element.datetimepicker('setEndDate', options.endDate);
                        }
                    });
                }
            }

            /*==========  Init  ==========*/

            if(isAppleTouch) {
                // Use native interface for touch devices
                element.prop('type', 'date').css('-webkit-appearance', 'textfield');
            } else {
                init();
                defineBehaviors();
                initController();
            }

        }
    };
}]);
