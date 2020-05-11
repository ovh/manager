import angular from 'angular';

export default function () {
  const defaultOptions = {
    placement: 'top',
    animation: true,
    popupDelay: 0,
  };

  const triggerMap = {
    mouseenter: 'mouseleave',
    click: 'click',
    focus: 'blur',
  };

  const globalOptions = {};

  this.options = function options(value) {
    angular.extend(globalOptions, value);
  };

  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };

  function snakeCase(name) {
    return name.replace(/[A-Z]/g, (letter, pos) => (pos ? '-' : '') + letter.toLowerCase());
  }

  function getPosition(element) {
    const el = element[0];

    return $.extend(
      {},
      angular.isFunction(el.getBoundingClientRect)
        ? el.getBoundingClientRect()
        : {
          width: el.offsetWidth,
          height: el.offsetHeight,
        },
      element.offset(),
    );
  }

  this.$get = [
    '$compile',
    '$parse',
    '$document',
    '$interpolate',
    '$rootScope',
    function $get($compile, $parse, $document, $interpolate, $rootScope) {
      return function get(type, defaultTriggerShow) {
        let options;

        const prefix = angular.copy(type);

        let directiveName;

        let triggers;

        let startSym;

        let endSym;

        let template;

        let tooltipId;

        function setTriggers(trigger) {
          let hide;
          const show = trigger || options.trigger || defaultTriggerShow;

          if (angular.isDefined(options.trigger)) {
            hide = triggerMap[options.trigger] || show;
          } else {
            hide = triggerMap[show] || show;
          }

          return {
            show,
            hide,
          };
        }

        function init() {
          options = angular.extend({}, defaultOptions, globalOptions);
          directiveName = snakeCase(type);
          triggers = setTriggers();
          startSym = $interpolate.startSymbol();
          endSym = $interpolate.endSymbol();
          template = `<div data-${directiveName}-popup `
            + `data-popover-tooltip-title="${startSym}ttTitle${endSym}"`
            + `data-popover-tooltip-content="${startSym}ttContent${endSym}" `
            + `data-popover-tooltip-placement="${startSym}ttPlacement${endSym}" `
            + `data-popover-tooltip-remote="${startSym}ttRemote${endSym}" `
            + `data-popover-tooltip-single="${startSym}ttSingle${endSym}"`
            + 'data-popover-tooltip-is-open="tooltipIsOpen" '
            + `data-popover-tooltip-id="${tooltipId}"></div>`;
        }

        return {
          restrict: 'A',
          transclude: true,
          template: '<div ng-transclude></div>',
          scope: true,
          link($scope, element, attrs) {
            tooltipId = `popover${$scope.$id}`;

            init();

            element.addClass('popover-trigger');

            const body = angular.element('body');

            function broadcaster(e) {
              const tooltipElement = angular.element(`#${tooltipId}`)[0];

              if (tooltipElement) {
                const clickIsInsideTooltip = tooltipElement.contains(e.target);

                if (!clickIsInsideTooltip) {
                  $rootScope.$broadcast('popover.clickbody');
                }
              } else {
                $rootScope.$broadcast('popover.clickbody');
              }
            }

            body.bind('click', broadcaster);

            $scope.$on('$destroy', () => {
              body.unbind('click', broadcaster);
            });

            let tooltip = $compile(template)($scope);

            let isTooltipExist = false;

            $scope.tooltipIsOpen = false;

            function managePlacement(tooltipParam) {
              let ttPosition;
              let mousePos;

              // Get the position of the directive element.
              const position = options.appendToBody
                ? getPosition().offset(element)
                : getPosition(element);

              // Get the height and width of the tooltip so we can center it.
              const ttWidth = tooltipParam.prop('offsetWidth');
              const ttHeight = tooltipParam.prop('offsetHeight');

              // Calculate the tooltip's top and left coordinates to center it with
              // this directive.
              switch ($scope.ttPlacement) {
                case 'mouse':
                  mousePos = getPosition.mouse();
                  ttPosition = {
                    top: mousePos.y,
                    left: mousePos.x,
                  };
                  break;
                case 'right':
                  ttPosition = {
                    top: position.top + position.height / 2 - ttHeight / 2,
                    left: position.left + position.width,
                  };
                  break;
                case 'bottom':
                  ttPosition = {
                    top: position.top + position.height,
                    left: position.left + position.width / 2 - ttWidth / 2,
                  };
                  break;
                case 'left':
                  ttPosition = {
                    top: position.top + position.height / 2 - ttHeight / 2,
                    left: position.left - ttWidth,
                  };
                  break;
                default:
                  ttPosition = {
                    top: position.top - ttHeight,
                    left: position.left + position.width / 2 - ttWidth / 2,
                  };
                  break;
              }

              ttPosition.top += 'px';
              ttPosition.left += 'px';
              ttPosition.display = 'block';

              // Now set the calculated positioning.
              tooltipParam.css(ttPosition);

              setTimeout(() => {
                managePlacement(tooltipParam);
              }, 50);
            }

            // Show the tooltip popup element.
            function show() {
              tooltip = $compile(template)($scope);
              // Don't show empty tooltips.
              if ($scope.ttContent) {
                // Set the initial positioning.
                tooltip.css({
                  top: 0,
                  left: 0,
                  display: 'block',
                });

                if (!isTooltipExist) {
                  element.after(tooltip);
                  isTooltipExist = true;
                }

                managePlacement(tooltip);

                // And show the tooltip.
                $scope.tooltipIsOpen = true;
              }
            } // End show

            // Hide the tooltip popup element.
            function hide() {
              if ($scope.tooltipIsOpen === true) {
                // First things first: we don't show it anymore.
                $scope.tooltipIsOpen = false;
                tooltip.remove();
                isTooltipExist = false;
              }
            }


            $scope.hide = function () {
              hide();
            };

            function stopEvent(evt) {
              if (evt && evt.stopPropagation) {
                evt.stopPropagation();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind(evt) {
              stopEvent(evt);
              if ($scope.tooltipIsOpen === false) {
                $rootScope.$broadcast('popover.show', element, $scope.ttSingle);
                $scope.$apply(show);
              }
            }

            function hideTooltipBind(evt) {
              stopEvent(evt);
              if ($scope.tooltipIsOpen === true) {
                $scope.$apply(() => {
                  hide();
                });
              }
            }

            function toggleTooltipBind(evt) {
              stopEvent(evt);
              if ($scope.tooltipIsOpen === false) {
                showTooltipBind(evt);
              } else {
                hideTooltipBind(evt);
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
            attrs.$observe(type, (val) => {
              $scope.ttContent = val;
            });
            attrs.$observe(`${prefix}Placement`, (val) => {
              $scope.ttPlacement = angular.isDefined(val) ? val : options.placement;
            });

            attrs.$observe(`${prefix}Trigger`, (val) => {
              element.unbind(triggers.show);
              element.unbind(triggers.hide);

              triggers = setTriggers(val);

              triggerBinding();
            });

            attrs.$observe(`${prefix}Title`, (val) => {
              $scope.ttTitle = val;
            });
            attrs.$observe(`${prefix}Remote`, (val) => {
              $scope.ttRemote = val;
            });
            attrs.$observe(`${prefix}Single`, (val) => {
              $scope.ttSingle = val === 'true' || val === true;
            });

            /**
             * Manage scope events
             */
            $scope.$on('$destroy', () => {
              tooltip.unbind('click', stopEvent);

              element.unbind(triggers.show);
              element.unbind(triggers.hide);

              if ($scope.tooltipIsOpen === true) {
                hide();
              } else {
                tooltip.remove();
              }
            });

            $scope.$on('popover.show', (evt, elm, all) => {
              if (
                elm !== element
                && ($scope.ttSingle === true || all)
                && $scope.tooltipIsOpen === true
              ) {
                hideTooltipBind();
              }
            });
            $scope.$on('popover.clickbody', hideTooltipBind);

            // fix angular 1.3

            triggerBinding();

            // fix angular 1.3 - end
          }, // end link
        }; // end return directive factory
      }; // end returnservice
    },
  ]; // en return $get
}
