import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    backupInstance: '<',
    goBackToBackups: '<',
  },
  controller,
  template,
};

export default component;
