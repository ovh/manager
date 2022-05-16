import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import modalFormComponentModule from '../../modal-form';
import component from './zfs-options.component';
import { STATE_RESOLVE } from './zfs-options.constants';

const moduleName = 'ovhManagerNashaComponentsPartitionZfsOptions';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    modalFormComponentModule,
  ])
  .component('nashaComponentsPartitionZfsOptions', component)
  .constant('ZfsOptionsStateResolve', STATE_RESOLVE)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
