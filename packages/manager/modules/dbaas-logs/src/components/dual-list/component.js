import controller from './controller';
import template from './template.html';

export default {
  template,
  controller,
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
    // Renders the attached (target) pane alone, with its per-item remove
    // affordance: the source pane and every add control disappear.
    revokeOnly: '<?',
  },
};
