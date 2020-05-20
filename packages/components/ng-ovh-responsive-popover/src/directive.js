/**
 *  @ngdoc directive
 *
 *  @name responsivePopover.directive:responsivePopover
 *
 *  @description
 *  This is the main directive of the `responsivePopover` module. In fact it's an extended
 *  uibPopover with an additional class applied to it's content template.
 *
 *  For available options, see the doc of [uibPopover](https://angular-ui.github.io/bootstrap/#/popover).
 *
 *  @example
 *  The following example will open a popover with the content of path/of/popover/content.html
 *  file inside. This popover will be closed when focus is lost inside of it.
 *  <pre>
 *  <button type="button"
 *          data-responsive-popover="'path/of/popover/content.html'"
 *          data-popover-placement="bottom-left"
 *          data-popover-trigger="focus">
 *  </button>
 *  </pre>
 */
export default /* @ngInject */ ($uibTooltip) =>
  $uibTooltip('responsivePopover', 'popover', 'click', {
    useContentExp: true,
  });
