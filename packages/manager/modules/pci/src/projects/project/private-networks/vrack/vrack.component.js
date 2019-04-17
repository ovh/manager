import controller from './vrack.controller';
import template from './vrack.html';

export default {
  bindings: {
    projectId: '<',
    createVrack: '<',
    operationId: '<?',
    onVrackCreated: '<',
  },
  controller,
  template,
};
