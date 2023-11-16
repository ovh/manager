export default class {
  /* @ngInject */
  constructor($timeout, $element, $window) {
    this.$timeout = $timeout;
    this.$element = $element;
    this.$window = $window;
    this.boundOnResize = () => this.onResize();
  }

  $onInit() {
    this.hasLenghtyQuery = false;
    this.expanded = false;
    this.$timeout(() => {
      this.createResizeObserver();
      this.evalExpandButtonVisibility();
    });
  }

  onResize() {
    this.expanded = false;
    this.$timeout(() => {
      this.evalExpandButtonVisibility();
    }, 100);
  }

  createResizeObserver() {
    angular.element(this.$window).on('resize', this.boundOnResize);
  }

  evalExpandButtonVisibility() {
    const [textElement] = this.$element.find('div');
    this.hasLenghtyQuery =
      textElement?.scrollWidth > textElement?.offsetWidth ||
      textElement?.scrollHeight > textElement?.offsetHeight;
  }

  $onDestroy() {
    angular.element(this.$window).off('resize', this.boundOnResize);
  }
}
