import template from './simplepopover.html';

export default function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      popoverTooltipTitle: '@',
      popoverTooltipContent: '@',
      popoverTooltipPlacement: '@',
      popoverTooltipRemote: '@',
      popoverTooltipId: '@',
      popoverTooltipIsOpen: '=',
    },
    template,
  };
}
