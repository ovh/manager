import template from './template.html';

export default {
  template,
  bindings: {
    usage: '<',
    direction: '<',
  },
  controller() {
    this.$onInit = () => {
      this.direction = this.direction || 'row';
    };

    this.getIconName = function getIconName(type) {
      switch (type) {
        case 'usedbysnapshots':
          return 'serverSave';
        default:
          return 'harddisk';
      }
    };
  },
};
