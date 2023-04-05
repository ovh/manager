import angular from 'angular';

import actionSelectComponent from './actionSelect/actionSelect.component';
import advancedModeSwitchComponent from './advancedModeSwitch/advancedModeSwitch.component';
import advancedModeSwitchResolves from './advancedModeSwitch/advancedModeSwitch.resolves';
import createPolicyComponent from './createPolicy/createPolicy.component';
import createPolicyResolves from './createPolicy/createPolicy.resolves';
import deleteEntityComponent from './deleteEntity/deleteEntity.component';
import deleteEntityResolves from './deleteEntity/deleteEntity.resolves';
import iamComponent from './iam/iam.component';
import onboardingComponent from './onboarding/onboarding.component';
import onboardingResolves from './onboarding/onboarding.resolves';
import policyIdentitiesComponent from './policyIdentities/policyIdentities.component';
import policyIdentitiesResolves from './policyIdentities/policyIdentities.resolves';
import policiesComponent from './policies/policies.component';
import policiesResolves from './policies/policies.resolves';
import policyComponent from './policy/policy.component';
import policyResolves from './policy/policy.resolves';
import resourceGroupsComponent from './resourceGroups/resourceGroups.component';
import resourceGroupsResolves from './resourceGroups/resourceGroups.resolves';
import resourceSelectComponent from './resourceSelect/resourceSelect.component';

import highlightTextDirective from './highlightText/highlightText.directive';

const actionSelect = {
  name: 'iamActionSelect',
  component: actionSelectComponent,
  resolves: null,
};

const advancedModeSwitch = {
  name: 'iamAdvancedModeSwitch',
  component: advancedModeSwitchComponent,
  resolves: advancedModeSwitchResolves,
};

const createPolicy = {
  name: 'iamCreatePolicy',
  component: createPolicyComponent,
  resolves: createPolicyResolves,
};

const deleteEntity = {
  name: 'iamDeleteEntity',
  component: deleteEntityComponent,
  resolves: deleteEntityResolves,
};

const iam = {
  name: 'iam',
  component: iamComponent,
  resolves: null,
};

const onboarding = {
  name: 'iamOnboarding',
  component: onboardingComponent,
  resolves: onboardingResolves,
};

const policyIdentities = {
  name: 'policyIdentities',
  component: policyIdentitiesComponent,
  resolves: policyIdentitiesResolves,
};

const policies = {
  name: 'iamPolicies',
  component: policiesComponent,
  resolves: policiesResolves,
};

const policy = {
  name: 'iamPolicy',
  component: policyComponent,
  resolves: policyResolves,
};

const resourceGroups = {
  name: 'iamResourceGroups',
  component: resourceGroupsComponent,
  resolves: resourceGroupsResolves,
};

const resourceSelect = {
  name: 'iamResourceSelect',
  component: resourceSelectComponent,
  resolves: null,
};

const highlightText = {
  name: 'iamHighlightText',
  directive: highlightTextDirective,
};

const moduleName = 'ovhManagerIAMComponents';

angular
  .module(moduleName, [])
  .component(actionSelect.name, actionSelect.component)
  .component(advancedModeSwitch.name, advancedModeSwitch.component)
  .component(createPolicy.name, createPolicy.component)
  .component(deleteEntity.name, deleteEntity.component)
  .component(iam.name, iam.component)
  .component(onboarding.name, onboarding.component)
  .component(policyIdentities.name, policyIdentities.component)
  .component(policies.name, policies.component)
  .component(policy.name, policy.component)
  .component(resourceGroups.name, resourceGroups.component)
  .component(resourceSelect.name, resourceSelect.component)
  .directive(highlightText.name, highlightText.directive)
  .run(/*
    @ngTranslationsInject:json
      ./actionSelect/translations
      ./advancedModeSwitch/translations
      ./createPolicy/translations
      ./cursorDatagrid/translations
      ./deleteEntity/translations
      ./iam/translations
      ./onboarding/translations
      ./policyIdentities/translations
      ./policies/translations
      ./policy/translations
      ./resourceGroups/translations
      ./resourceSelect/translations
  */);

export {
  advancedModeSwitch,
  createPolicy,
  deleteEntity,
  iam,
  onboarding,
  policyIdentities,
  policies,
  policy,
  resourceGroups,
};

export default moduleName;
