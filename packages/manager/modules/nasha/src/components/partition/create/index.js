import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import modalFormComponentModule from '../../modal-form';
import forbidDirectiveModule from '../../../directives/forbid';
import component from './create.component';

const moduleName = 'ovhManagerNashaComponentsPartitionCreate';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    modalFormComponentModule,
    forbidDirectiveModule,
  ])
  .component('nashaComponentsPartitionCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
