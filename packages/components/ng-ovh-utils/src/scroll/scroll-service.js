/**
 * @type service
 * @name ovhServices:ScrollService
 * @description
 * Provide scroll methods
 * @example
 * # Usage
 * <code:js>
 * export default class PciStoragesContainersContainerController {
 *  */ /* @ngInject */ /*
 *  constructor(ScrollService) {
 *    this.ScrollService = ScrollService
 *  }
 *
 *  $onInit() {
 *    ScrollService.scrollTop();
 *  };
 *};
 *
 * </code>
 */
export default /* @ngInject */ function scrollService(
  $document,
  $timeout,
  $anchorScroll,
) {
  this.scrollTop = function scrollTop() {
    $document[0].body.style.setProperty('height', 'auto', 'important');
    $document[0].body.style.setProperty('overflow', 'auto');
    $anchorScroll();
    $timeout(function() {
      $document[0].body.style.removeProperty('height');
      $document[0].body.style.removeProperty('overflow');
    });
  };
}
