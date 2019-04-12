import controller from './volume-edit.controller';
import template from './volume-edit.html';

export default {
  controller,
  template,
  bindings: {
    storage: '=',
    projectId: '<',
    title: '<',
    sizeEditable: '<?',
    displayBootable: '<?',
    submitLabel: '<',
    onSubmit: '&',
    onCancel: '&',
    showLoading: '<',
  },
};
