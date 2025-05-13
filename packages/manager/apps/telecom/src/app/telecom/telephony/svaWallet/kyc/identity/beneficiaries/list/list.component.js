import template from './list.html';

export default {
  template,
  bindings: {
    beneficiaries: '=',
    onEdit: '&',
    onDelete: '&',
    editable: '<',
  },
};
