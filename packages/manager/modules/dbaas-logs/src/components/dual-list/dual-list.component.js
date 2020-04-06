import controller from './dual-list.controller';
import template from './dual-list.html';

export default {
  bindings: {
    sourceListLabel: '@',
    targetListLabel: '@',
    moveAllLabel: '@',
    removeAllLabel: '@',
    sourceListEmptyLabel: '@',
    targetListEmptyLabel: '@',
    addLabel: '@',
    property: '@',
    height: '@',
    sourceList: '<?',
    targetList: '<?',
    onAdd: '&',
    onRemove: '&',
    bulkActionEnabled: '<',
  },
  controller,
  template,
};
