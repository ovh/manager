import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-feature-flipping';

import component from './component';
import routing from './routing';

import create from './create';
import deleteModule from './delete';
import dashboard from './dashboard';
import editSize from './edit-size';
import editReserveSpace from './edit-reserve-space';
import capacityBar from './components/capacity-bar';

const moduleName = 'ovhManagerNetAppVolumes';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    create,
    deleteModule,
    dashboard,
    editSize,
    editReserveSpace,
    capacityBar,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
