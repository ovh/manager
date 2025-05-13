import angular from 'angular';

import component from './identities.component';
import userIdentities from './userIdentities';
import groupIdentities from './groupIdentities';
import serviceAccountIdentities from './serviceAccountIdentities';
import accountIdentities from './accountIdentities';

const moduleName = 'ovhManagerIAMComponentsIdentities';

angular
  .module(moduleName, [
    userIdentities,
    groupIdentities,
    serviceAccountIdentities,
    accountIdentities,
  ])
  .component('iamPolicyIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
