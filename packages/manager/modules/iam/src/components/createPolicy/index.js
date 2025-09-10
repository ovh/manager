import angular from 'angular';

import actionSelect from '../actionSelect';
import deleteEntity from '../deleteEntity';
import resourceSelect from '../resourceSelect';
import identities from '../identities';
import conditionList from '../conditions/conditionList';
import conditionOperator from '../conditions/operator';

import component from './createPolicy.component';

const moduleName = 'ovhManagerIAMComponentsCreatePolicy';

angular
  .module(moduleName, [
    actionSelect,
    deleteEntity,
    resourceSelect,
    identities,
    conditionList,
    conditionOperator,
  ])
  .component('iamCreatePolicy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
