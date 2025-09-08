import controller from './createConditionModal.controller';
import template from './createConditionModal.template.html';

export const name = 'iamCreateConditionModal';

export default {
  bindings: {
    onClose: '&',
    onConfirm: '<',
  },
  controller,
  template,
};
