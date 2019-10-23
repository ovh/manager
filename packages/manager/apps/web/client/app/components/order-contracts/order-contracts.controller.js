export default class {
  constructor($element, $timeout) {
    this.$element = $element;
    this.$timeout = $timeout;
  }

  $postLink() {
    this.$timeout(() => this.$element.removeAttr('name'));
  }
}
