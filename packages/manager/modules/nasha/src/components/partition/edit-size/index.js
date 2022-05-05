import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import modalFormComponentModule from '../../modal-form';
import component from './edit-size.component';

const moduleName = 'ovhManagerNashaComponentsPartitionEditSize';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    modalFormComponentModule,
  ])
  .component('nashaComponentsPartitionEditSize', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
