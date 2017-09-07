angular.module('ua.popover').provider('popoverFactory', function () {
    "use strict";

    var defaultOptions,
        triggerMap,
        globalOptions;

    defaultOptions = {
        placement   : 'top',
        animation   : true,
        popupDelay  : 0
    };

    triggerMap = {
        mouseenter  : 'mouseleave',
        click       : 'click',
        focus       : 'blur'
    };

    globalOptions = {};

    this.options = function (value) {
        angular.extend(globalOptions, value);
    };

    this.setTriggers = function setTriggers (triggers) {
        angular.extend(triggerMap, triggers);
    };

    function snakeCase (name) {
        return name.replace(/[A-Z]/g, function (letter, pos) {
            return (pos ? '-' : '') + letter.toLowerCase();
        });
    }

    function getPosition(element) {
        var el = element[0];

        return $.extend({}, angular.isFunction(el.getBoundingClientRect) ? el.getBoundingClientRect() : {
            width  : el.offsetWidth,
            height : el.offsetHeight
        }, element.offset());
    }

    this.$get = ['$compile', '$parse', '$document', '$interpolate', '$rootScope',
        function ($compile,   $parse,   $document,   $interpolate,   $rootScope) {
            return function (type, defaultTriggerShow) {
                var options,
                prefix = angular.copy(type),
                directiveName,
                triggers,
                startSym,
                endSym,
                template,
                tooltipId;

                function setTriggers(trigger) {
                    var show,
                    hide;

                    show = trigger || options.trigger || defaultTriggerShow;

                    if (angular.isDefined(options.trigger)) {
                        hide = triggerMap[options.trigger] || show;
                    } else {
                        hide = triggerMap[show] || show;
                    }

                    return {
                        show : show,
                        hide : hide
                    };
                }

                function init() {
                    options       = angular.extend({}, defaultOptions, globalOptions);
                    directiveName = snakeCase(type);
                    triggers      = setTriggers();
                    startSym      = $interpolate.startSymbol();
                    endSym        = $interpolate.endSymbol();
                    template      = '<div data-' + directiveName + '-popup ' +
                                    'data-popover-tooltip-title="' + startSym + 'ttTitle' + endSym + '"' +
                                    'data-popover-tooltip-content="' + startSym + 'ttContent' + endSym + '" ' +
                                    'data-popover-tooltip-placement="' + startSym + 'ttPlacement' + endSym + '" ' +
                                    'data-popover-tooltip-remote="' + startSym + 'ttRemote' + endSym +'" ' +
                                    'data-popover-tooltip-single="' + startSym +'ttSingle' + endSym + '"' +
                                    'data-popover-tooltip-is-open="tooltipIsOpen" ' +
                                    'data-popover-tooltip-id="' + tooltipId + '"></div>';
                }

                return {
                    restrict       : 'A',
                    transclude     : true,
                    template       : '<div ng-transclude></div>',
                    scope          : true,
                    link           : function ($scope, element, attrs) {
                        tooltipId = 'popover' + $scope.$id;

                        init();

                        element.addClass('popover-trigger');

                        var body = angular.element('body');

                        function broadcaster (e) {
                            var tooltipElement = angular.element('#' + tooltipId)[0];

                            if (tooltipElement) {
                                var clickIsInsideTooltip = tooltipElement.contains(e.target);

                                if (!clickIsInsideTooltip) {
                                    $rootScope.$broadcast('popover.clickbody');
                                }
                            } else {
                                $rootScope.$broadcast('popover.clickbody');
                            }
                        }

                        body.bind('click', broadcaster);

                        $scope.$on('$destroy', function () {
                            body.unbind('click', broadcaster);
                        });

                        var tooltip              = $compile(template)($scope),
                        isTooltipExist       = false;

                        $scope.tooltipIsOpen = false;

                        $scope.hide = function () {
                            hide();
                        };

                        function stopEvent(evt) {
                            if (evt && evt.stopPropagation) {
                                evt.stopPropagation();
                            }
                        }

                        function toggleTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === false) {
                                showTooltipBind(evt);
                            } else {
                                hideTooltipBind(evt);
                            }
                        }

                        // Show the tooltip with delay if specified, otherwise show it immediately
                        function showTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === false) {
                                $rootScope.$broadcast('popover.show', element, $scope.ttSingle);
                                $scope.$apply(show);
                            }
                        }

                        function hideTooltipBind (evt) {
                            stopEvent(evt);
                            if ($scope.tooltipIsOpen === true) {
                                $scope.$apply(function () {
                                    hide();
                                });
                            }
                        }

                        function managePlacement (tooltip) {

                            var position,
                                ttWidth,
                                ttHeight,
                                ttPosition,
                                mousePos;

                            // Get the position of the directive element.
                            position = options.appendToBody ? getPosition().offset(element) : getPosition(element);

                            // Get the height and width of the tooltip so we can center it.
                            ttWidth = tooltip.prop('offsetWidth');
                            ttHeight = tooltip.prop('offsetHeight');

                            // Calculate the tooltip's top and left coordinates to center it with
                            // this directive.
                            switch ($scope.ttPlacement) {
                            case 'mouse':
                                mousePos = getPosition.mouse();
                                ttPosition = {
                                    top     : mousePos.y,
                                    left    : mousePos.x
                                };
                                break;
                            case 'right':
                                ttPosition = {
                                    top     : position.top + position.height / 2 - ttHeight / 2,
                                    left    : position.left + position.width
                                };
                                break;
                            case 'bottom':
                                ttPosition = {
                                    top     : position.top + position.height,
                                    left    : position.left + position.width / 2 - ttWidth / 2
                                };
                                break;
                            case 'left':
                                ttPosition = {
                                    top     : position.top + position.height / 2 - ttHeight / 2,
                                    left    : position.left - ttWidth
                                };
                                break;
                            default:
                                ttPosition = {
                                    top     : position.top - ttHeight,
                                    left    : position.left + position.width / 2 - ttWidth / 2
                                };
                                break;
                            }

                            ttPosition.top += 'px';
                            ttPosition.left += 'px';
                            ttPosition.display = 'block';

                            // Now set the calculated positioning.
                            tooltip.css(ttPosition);

                            setTimeout(function() {
                                managePlacement(tooltip);
                            }, 50);
                        }

                        // Show the tooltip popup element.
                        function show () {
                            tooltip = $compile(template)($scope);
                            // Don't show empty tooltips.
                            if ($scope.ttContent) {
                                // Set the initial positioning.
                                tooltip.css({
                                    top     : 0,
                                    left    : 0,
                                    display : 'block'
                                });

                                if (!isTooltipExist) {
                                    element.after(tooltip);
                                    isTooltipExist = true;
                                }

                                managePlacement(tooltip);

                                // And show the tooltip.
                                $scope.tooltipIsOpen = true;
                            }
                        }//End show

                        // Hide the tooltip popup element.
                        function hide () {
                            if ($scope.tooltipIsOpen === true) {
                                // First things first: we don't show it anymore.
                                $scope.tooltipIsOpen = false;
                                tooltip.remove();
                                isTooltipExist = false;
                            }
                        }

                        function triggerBinding() {
                            if (triggers.show === triggers.hide) {
                                element.bind(triggers.show, toggleTooltipBind);
                            } else {
                                element.bind(triggers.show, showTooltipBind);
                                element.bind(triggers.hide, hideTooltipBind);
                            }

                            if (triggers.show === 'click') {
                                tooltip.bind('click', stopEvent);
                            } else {
                                tooltip.unbind('click', stopEvent);
                            }
                        }

                        /**
                         * Observe the relevant attributes.
                         */
                        attrs.$observe(type, function (val) {
                            $scope.ttContent = val;
                        });
                        attrs.$observe(prefix + 'Placement', function (val) {
                            $scope.ttPlacement = angular.isDefined(val) ? val : options.placement;
                        });

                        attrs.$observe(prefix + 'Trigger', function (val) {

                            element.unbind(triggers.show);
                            element.unbind(triggers.hide);

                            triggers = setTriggers(val);

                            triggerBinding();
                        });

                        attrs.$observe(prefix + 'Title', function (val) {
                            $scope.ttTitle = val;
                        });
                        attrs.$observe(prefix + 'Remote', function (val) {
                            $scope.ttRemote = val;
                        });
                        attrs.$observe(prefix + 'Single', function (val) {
                            $scope.ttSingle = val === "true" || val === true;
                        });

                        /**
                         * Manage scope events
                         */
                        $scope.$on('$destroy', function onDestroyTooltip () {
                            tooltip.unbind('click', stopEvent);

                            element.unbind(triggers.show);
                            element.unbind(triggers.hide);

                            if ($scope.tooltipIsOpen === true) {
                                hide();
                            } else {
                                tooltip.remove();
                            }
                        });

                        $scope.$on('popover.show', function (evt, elm, all) {
                            if (elm !== element && ($scope.ttSingle === true || all) && $scope.tooltipIsOpen === true) {
                                hideTooltipBind();
                            }
                        });
                        $scope.$on('popover.clickbody', hideTooltipBind);


                        // fix angular 1.3

                        triggerBinding();

                        // fix angular 1.3 - end


                    }//end link
                };//end return directive factory
            };// end returnservice
        }];//en return $get
});
