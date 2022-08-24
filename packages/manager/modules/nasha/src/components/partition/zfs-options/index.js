import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import modalFormComponentModule from '../../modal-form';
import component from './zfs-options.component';

const moduleName = 'ovhManagerNashaComponentsPartitionZfsOptions';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    modalFormComponentModule,
  ])
  .component('nashaComponentsPartitionZfsOptions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
