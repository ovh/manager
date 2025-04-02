import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import routing from './routing';
import editReserveSpace from '../../components/edit-reserve-space';

const moduleName = 'ovhManagerNetAppVolumesDashboardEditReserveSpace';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    editReserveSpace,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
