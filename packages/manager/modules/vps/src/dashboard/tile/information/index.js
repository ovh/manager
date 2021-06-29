import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './information.component';
import vpsStateInfo from '../../components/vps-state-info';

const moduleName = 'ovhManagerVpsDashboardTileInformation';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    vpsStateInfo,
  ])
  .component('vpsDashboardTileInformation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
