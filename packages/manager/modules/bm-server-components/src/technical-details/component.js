import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    technicalDetails: '<',
    onRamUpgrade: '&?',
    onDiskUpgrade: '&?',
  },
  controller,
  template,
};
