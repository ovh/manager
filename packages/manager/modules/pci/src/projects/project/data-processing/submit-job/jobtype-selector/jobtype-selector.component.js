import controller from './jobtype-selector.controller';
import template from './jobtype-selector.html';

export default {
  template,
  controller,
  bindings: {
    onChangeHandler: '<',
    jobEngines: '<',
  },
};
