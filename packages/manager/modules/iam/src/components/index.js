import angular from 'angular';

import actionSelect from './actionSelect';
import advancedModeSwitch from './advancedModeSwitch';
import createPolicy from './createPolicy';
import deleteEntity from './deleteEntity';
import highlightText from './highlightText';
import iam from './iam';
import onboarding from './onboarding';
import policies from './policies';
import policy from './policy';
import policyIdentities from './policyIdentities';
import resourceGroups from './resourceGroups';
import resourceSelect from './resourceSelect';

const moduleName = 'ovhManagerIAMComponents';

angular.module(moduleName, [
  actionSelect,
  advancedModeSwitch,
  createPolicy,
  deleteEntity,
  highlightText,
  iam,
  onboarding,
  policies,
  policy,
  policyIdentities,
  resourceGroups,
  resourceSelect,
]);

export default moduleName;
