import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    options: '<',
    version: '<',
    agoraEnabled: '<',
    onOptionsChange: '&',
  },
  controller,
  template,
};
