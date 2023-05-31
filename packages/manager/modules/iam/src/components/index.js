import angular from 'angular';

import actionSelect from './actionSelect';
import advancedModeSwitch from './advancedModeSwitch';
import createPolicy from './createPolicy';
import deleteEntity from './deleteEntity';
import highlightText from './highlightText';
import resourceSelect from './resourceSelect';

const moduleName = 'ovhManagerIAMComponents';

angular.module(moduleName, [
  actionSelect,
  advancedModeSwitch,
  createPolicy,
  deleteEntity,
  highlightText,
  resourceSelect,
]);

export default moduleName;
