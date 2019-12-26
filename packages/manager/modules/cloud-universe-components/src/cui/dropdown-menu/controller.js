import angular from 'angular';

let lastDropdownMenuController;

/*
 * Temporary implementation of dropdown-menu.
 */
export default class CuiDropdownMenuController {
  /* @ngInject */
  constructor($element, $scope, $rootScope, $window) {
    this.$element = $element;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$window = $window;
  }

  $postLink() {
    this.$element.addClass('cui-dropdown-menu');
  }

  $onInit() {
    this.show = false;
    this.hideMenu = () => this.$rootScope.$broadcast('ouiDropdownMenu.hide');

    angular.element(this.$window.document).on('click', this.hideMenu);
  }

  $onDestroy() {
    if (this.unregisterListeners) {
      this.unregisterListeners();
    }

    angular.element(this.$window.document).off('click', this.hideMenu);
  }

  toggle($event) {
    $event.stopPropagation();

    this.show = !this.show;

    if (this.show) {
      if (lastDropdownMenuController) {
        lastDropdownMenuController.toggle($event);
      }
      lastDropdownMenuController = this;
      this.unregisterListeners = this.$scope.$on('ouiDropdownMenu.hide', () => {
        this.$scope.$apply(() => {
          this.show = false;
          lastDropdownMenuController = null;
        });
        this.unregisterListeners();
      });
    } else {
      this.unregisterListeners();
      lastDropdownMenuController = null;
    }
  }

  keydown($event) {
    if ($event.keyCode === 32) {
      $event.preventDefault();
      this.toggle($event);
    }
  }
}
