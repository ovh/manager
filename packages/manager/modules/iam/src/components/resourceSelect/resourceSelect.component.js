import controller from './resourceSelect.controller';
import template from './resourceSelect.template.html';

export default {
  bindings: {
    onChange: '&?',
    onError: '&?',
    required: '<',
    resourcesLabel: '@',
    resourcesModel: '=',
    resourcesName: '@',
    resourcesRequiredMessage: '@?',
    resourceTypesLabel: '@',
    resourceTypesModel: '=',
    resourceTypesName: '@',
    size: '@?',
  },
  controller,
  template,
  transclude: {
    resourcesHeaderSlot: 'resourcesHeader',
    resourceTypesHeaderSlot: 'resourceTypesHeader',
  },
};
