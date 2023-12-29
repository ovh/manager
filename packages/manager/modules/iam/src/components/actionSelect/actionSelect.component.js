import controller from './actionSelect.controller';
import template from './actionSelect.template.html';

import './actionSelect.styles.scss';

export default {
  bindings: {
    error: '&?',
    load: '&?',
    name: '@?',
    ngModel: '<',
    readOnly: '<?',
    required: '@?',
    resourceTypes: '<',
    tagPrefix: '<',
    trackClick: '<',
    trackPage: '<',
    permissionsGroups: '<',
  },
  require: {
    requiredNgModel: '^ngModel',
  },
  controller,
  template,
};
