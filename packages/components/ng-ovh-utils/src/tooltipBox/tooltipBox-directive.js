/**
 * @ngdoc directive
 * @name ovhDirectives.directive:tooltipBox
 * @element ANY
 * @requires Bootstrap (2.3.0+) Popover
 *
 * @decription
 * Provide a directive for the Bootstrap Popover.
 *
 * @version 1.0.1
 *
 * @example
 * <code:html>
 *
 *  <div data-ng-controller="testCtrl">
 *
 *      <button type="button" class="btn"
 *          data-tooltip-box
 *
 *          <!-- (title/contentText OR contentTemplate) -->
 *          data-tb-title="'Hello'" <!-- Title can be "text", of type string (with quotes) -->
 *          data-tb-title="myPopoverTitle" <!-- ... or set by a variable -->
 *          data-tb-content-text="'Hello, my name is Kevin'"
 *          <!-- Content can be "text", of type string (with quotes) -->
 *          data-tb-content-text="myPopoverContent"
 *          <!-- ... or set by a variable -->
 *          data-tb-content-template="views/toto/popover.html"
 *          <!-- Otherwise, content can be a template file -->
 *
 *          data-tb-unique="true"
 *          <!-- Hide any active popover except self -->
 *          data-tb-placement="bottom"
 *          data-tb-container="selector"
 *          <!-- (default: body) Appends the popover to a specific element -->
 *          data-tb-hide-on-blur="true"
 *          <!-- (default: false) Hide popover when click outside -->
 *          data-*="All other bootstrap popover options">
 *              Click me!
 *      </button>
 *
 *  </div>
 *
 * </code>
 */
import angular from 'angular';

export default /* @ngInject */ function (
  tooltipBoxConfig,
  $compile,
  $http,
  $rootScope,
  $window,
  $parse,
) {
  /**
   * @doc method
   * @methodOf ovhDirectives.directive:tooltipBox
   * @name ovhDirectives.directive:tooltipBox#getPosition
   * @param {node} element The DOM element.
   * @returns {object} Position of the element
   *
   * @description
   * Return the position of an element.
   */
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

  return {
    restrict: 'A',
    replace: false,
    link($scope, el, attrs) {
      const options = {};

      let popover;

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#setOptions
       *
       * @description
       * Sets the directive's options, using the datas of the element.
       */
      function setOptions() {
        let prefixedKey = '';
        angular.forEach(tooltipBoxConfig, (key) => {
          prefixedKey = `tb${key.charAt(0).toUpperCase() + key.slice(1)}`;
          if (angular.isDefined(attrs[prefixedKey])) {
            switch (key) {
              case 'title':
                options.title = $parse(attrs[prefixedKey])($scope);
                // Can be a string (so, put simple quotes) or a var
                break;
              case 'contentText':
                options.content = $parse(attrs[prefixedKey])($scope);
                // Can be a string (so, put simple quotes) or a var
                break;
              case 'animation':
              case 'html':
              case 'unique':
              case 'hideOnBlur':
                options[key] = $parse(attrs[prefixedKey])($scope); // Boolean values
                break;
              default:
                options[key] = attrs[prefixedKey];
            }
          }
        });
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#managePlacement
       *
       * @description
       * Manage the placement of the popover.
       */
      function managePlacement() {
        const $tip = $(popover.$tip);

        const tipWidth = $tip.outerWidth();

        const tipHeight = $tip.outerHeight();

        const elPos = getPosition(el);

        const windowWidth = $(window).width();

        const { placement } = options;

        $tip.addClass('tooltipBox-tip').addClass(placement);

        // @todo Update code to have all cases + responsive.

        switch (placement) {
          case 'bottom':
            // If the datetimepicker overflow, pull it right.
            if (windowWidth < elPos.left + tipWidth) {
              $tip.css({
                top: elPos.top + elPos.height + 10,
                left: 'auto',
                right: windowWidth - elPos.left - el[0].offsetWidth,
              });
              $tip.addClass('pull-right');
            } else {
              $tip.css({
                top: elPos.top + elPos.height + 10,
                left: elPos.left + elPos.width / 2 - tipWidth / 2,
                right: 'auto',
              });
              $tip.removeClass('pull-right');
            }
            break;
          case 'top':
            $tip.css({
              top: elPos.top - tipHeight,
              left: elPos.left + elPos.width / 2 - tipWidth / 2,
            });
            break;
          case 'left':
            $tip.css({
              top: elPos.top + elPos.height / 2 - tipHeight / 2,
              left: elPos.left - tipWidth,
            });
            break;
          case 'right':
            $tip.css({
              top: elPos.top + elPos.height / 2 - tipHeight / 2,
              left: elPos.left + elPos.width,
            });
            break;
          case 'rightTop':
            $tip.css({
              top: elPos.top + elPos.height / 2 - tipHeight * 0.25,
              left: elPos.left + elPos.width,
            });
            break;
          default:
            break;
        }
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#hideOnEsc
       *
       * @description
       * Hide the popover when pressing escape touch.
       */
      function hideOnEsc(e) {
        if (e.keyCode === 27 && popover.$tip && popover.$tip.is(':visible')) {
          el.popover('hide');
        }
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#hideOnBlur
       *
       * @description
       * Hide the popover when clicking outside.
       */
      function hideOnBlur(e) {
        if (
          popover.$tip
          && popover.$tip.is(':visible')
          && !el.is(e.target)
          && popover.$tip.has(e.target).length === 0
        ) {
          el.popover('hide');
        }
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#windowResize
       *
       * @description
       * Adjust the position on window resize.
       */
      function windowResize() {
        let to;

        if (popover.$tip && popover.$tip.is(':visible')) {
          to = $window.setTimeout(() => {
            managePlacement();
            $window.clearTimeout(to);
          }, 50);
        }
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#destroy
       *
       * @description
       * Destroy the directive.
       */
      function destroy() {
        if (popover && popover.$tip && popover.$tip.is(':visible')) {
          popover.$tip.remove();
          el.data('popover', null);
          el.data('bs.popover', null);
        }
        $('body').off('keyup', hideOnEsc);
        if (options.hideOnBlur) {
          $('body').off('click', hideOnBlur);
        }
        angular.element($window).unbind('resize', windowResize);
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#defineBehaviors
       *
       * @description
       * Define directive's behaviors.
       */
      function defineBehaviors(...args) {
        // Override Bootstrap's popover function to $compile
        popover.hasContent = function hasContent() {
          return this.getTitle() || options.content; // fix multiple $compile()
        };
        popover.getPosition = function () {
          const r = $.fn.popover.Constructor.prototype.getPosition.apply(popover, args);

          // @todo managePlacement here!

          $compile(popover.$tip)($scope);
          $scope.$digest();

          popover.$tip.data('popover', popover); // Bind a ref to the box

          return r;
        };

        el.on('show', () => {
          setTimeout(() => {
            managePlacement();
          }, 50);

          // If enabled, hide any active popover except self
          if (options.unique) {
            $('.popover.in').each(function () {
              const $this = $(this);

              const currentPopover = $this.data('popover');
              if (currentPopover && !currentPopover.$element.is(el)) {
                $this.popover('hide');
              }
            });
          }
        });

        // Hide the popover when pressing escape.
        $('body').on('keyup', hideOnEsc);

        // Hide the popover when clicking outside.
        if (options.hideOnBlur) {
          $('body').on('click', hideOnBlur);
        }

        // Adjust the position on window resize.
        angular.element($window).bind('resize', windowResize);

        // Garbage collection.
        $scope.$on('$destroy', destroy);
      }

      /**
       * @doc method
       * @methodOf ovhDirectives.directive:tooltipBox
       * @name ovhDirectives.directive:tooltipBox#init
       *
       * @description
       * Initialize the directive.
       */
      function init() {
        el.popover(
          angular.extend(options, {
            html: true,
          }),
        );

        popover = el.data('popover') ? el.data('popover') : el.data('bs.popover');
        defineBehaviors();

        $rootScope.$broadcast('ovhDirectives.tooltipBox.init');
      }

      $scope.show = function () {
        el.popover('show');
      };

      $scope.hide = function () {
        el.popover('hide');
      };

      $scope.$on('tooltipBox-hide', () => {
        el.popover('hide');
      });

      /*= =========  Init  ========== */

      setOptions();

      if (options.content) {
        init();
      } else {
        // Content is a template.
        $http
          .get(options.contentTemplate)
          .then((template) => {
            options.content = template.data;

            init();
          })
          .catch(() => {
            throw 'Error template tooltip'; // eslint-disable-line
          });
      }
    },
  };
}
