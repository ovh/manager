import controller from './resourceSelect.controller';
import template from './resourceSelect.template.html';
import './resourceSelect.styles.scss';

export default {
  bindings: {
    ngModel: '<',
    onChange: '&?',
    onError: '&?',
    onResourceTypesConfirmRemove: '&?',
    readOnly: '<?',
    required: '<',
    resourcesLabel: '@',
    resourcesName: '@',
    resourcesRequiredMessage: '@?',
    resourceTypesLabel: '@',
    resourceTypesName: '@',
    maxLength: '@',
  },
  require: {
    requiredNgModel: '^ngModel',
  },
  controller,
  template,
  transclude: {
    resourcesHeaderSlot: '?iamResourceSelectResourcesHeader',
    resourcesSiblingSlot: '?iamResourceSelectResourcesSibling',
    resourceTypesHeaderSlot: '?iamResourceSelectResourceTypesHeader',
  },
};
