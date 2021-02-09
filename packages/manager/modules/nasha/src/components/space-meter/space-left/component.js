import template from './template.html';

export default {
  template,
  bindings: {
    usage: '<',
    tooltip: '<',
    strong: '<',
    direction: '<',
  },
  controller($element) {
    'ngInject';

    this.$onInit = () => {
      this.direction = this.direction || 'row';
    };
    $element.addClass(`cloud-space-meter-space-left_${this.direction}`);
  },
};
