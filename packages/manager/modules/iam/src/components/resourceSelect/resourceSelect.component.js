import controller from './resourceSelect.controller';
import template from './resourceSelect.template.html';
import './resourceSelect.styles.scss';

export default {
  bindings: {
    onChange: '&?',
    onError: '&?',
    onResourceTypesConfirmRemove: '&?',
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
    resourcesHeaderSlot: '?resourcesHeader',
    resourcesSiblingSlot: '?resourcesSibling',
    resourceTypesHeaderSlot: '?resourceTypesHeader',
  },
};
