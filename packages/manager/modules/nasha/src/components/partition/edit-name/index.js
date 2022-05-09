import angular from 'angular';

import 'angular-translate';

import modalFormComponentModule from '../../modal-form';
import forbidDirectiveModule from '../../../directives/forbid';
import component from './edit-name.component';

const moduleName = 'ovhManagerNashaComponentsPartitionEditName';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    modalFormComponentModule,
    forbidDirectiveModule,
  ])
  .component('nashaComponentsPartitionEditName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
