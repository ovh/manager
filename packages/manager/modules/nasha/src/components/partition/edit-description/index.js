import angular from 'angular';

import 'angular-translate';

import modalFormComponentModule from '../../modal-form';
import forbidDirectiveModule from '../../../directives/forbid';
import component from './edit-description.component';

const moduleName = 'ovhManagerNashaComponentsPartitionEditDescription';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    modalFormComponentModule,
    forbidDirectiveModule,
  ])
  .component('nashaComponentsPartitionEditDescription', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
