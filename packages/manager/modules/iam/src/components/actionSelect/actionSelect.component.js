import controller from './actionSelect.controller';
import template from './actionSelect.template.html';

import './actionSelect.styles.scss';

export default {
  bindings: {
    error: '&?',
    load: '&?',
    name: '@?',
    ngModel: '<',
    onChange: '&?',
    readOnly: '<?',
    required: '@?',
    resourceTypes: '<',
    tagPrefix: '<',
    trackClick: '<?',
    trackPage: '<?',
    showActionWildcard: '<?',
    allowGroupSelection: '<?',
    expandByDefault: '<?',
    showPermissionsGroup: '<?',
    managedPermissionsLabel: '<?',
    permissionsGroups: '<',
  },
  require: {
    requiredNgModel: '^ngModel',
  },
  controller,
  template,
};
