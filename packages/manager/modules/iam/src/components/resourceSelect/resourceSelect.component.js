import controller from './resourceSelect.controller';
import template from './resourceSelect.template.html';
import './resourceSelect.styles.scss';

export default {
  bindings: {
    onChange: '&?',
    onError: '&?',
    onResourceTypesConfirmRemove: '&?',
    readOnly: '<?',
    required: '<',
    resourcesLabel: '@',
    resourcesModel: '=',
    resourcesName: '@',
    resourcesRequiredMessage: '@?',
    resourceTypesLabel: '@',
    resourceTypesModel: '=',
    resourceTypesName: '@',
  },
  controller,
  template,
  transclude: {
    resourcesHeaderSlot: '?iamResourceSelectResourcesHeader',
    resourcesSiblingSlot: '?iamResourceSelectResourcesSibling',
    resourceTypesHeaderSlot: '?iamResourceSelectResourceTypesHeader',
  },
};
