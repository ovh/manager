import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import modalFormComponentModule from '../../../modal-form';
import component from './delete.component';

const moduleName = 'ovhManagerNashaComponentsPartitionAccessDelete';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    modalFormComponentModule,
  ])
  .component('nashaComponentsPartitionAccessDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
