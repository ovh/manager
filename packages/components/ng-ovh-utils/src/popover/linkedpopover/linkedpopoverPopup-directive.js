export default function () {
  return {
    restrict: 'A',
    replace: true,
    template:
      '<div class="popover {{ttPlacement}} fade" data-ng-class="{ in: tooltipIsOpen}" id="{{tooltipId}}">'
      + '<div class="arrow"></div>'
      + '<div class="popover-inner">'
      + '<div class="popover-title popover-title-input" data-ng-bind="ttTitle"></div>'
      + '<div class="popover-content">'
      + '<div data-ng-if="ttRemote == \'true\'" data-ng-include="ttContent"></div>'
      + '<div data-ng-if="ttRemote != \'true\'" data-ng-bind-html="ttContent"></div>'
      + '</div>'
      + '</div>'
      + '</div>',
  };
}
