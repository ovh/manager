import angular from 'angular';

import createPolicyComponent from './createPolicy/createPolicy.component';
import createPolicyResolves from './createPolicy/createPolicy.resolves';
import deleteEntityComponent from './deleteEntity/deleteEntity.component';
import deleteEntityResolves from './deleteEntity/deleteEntity.resolves';
import iamComponent from './iam/iam.component';
import policiesComponent from './policies/policies.component';
import policiesResolves from './policies/policies.resolves';
import policyComponent from './policy/policy.component';
import policyResolves from './policy/policy.resolves';

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

const moduleName = 'ovhManagerIAMComponents';

angular
  .module(moduleName, [])
  .component(createPolicy.name, createPolicy.component)
  .component(deleteEntity.name, deleteEntity.component)
  .component(iam.name, iam.component)
  .component(policies.name, policies.component)
  .component(policy.name, policy.component)
  .run(/*
    @ngTranslationsInject:json
      ./createPolicy/translations
      ./deleteEntity/translations
      ./iam/translations
      ./policies/translations
      ./policy/translations
  */);

export { createPolicy, deleteEntity, iam, policies, policy };
export default moduleName;
