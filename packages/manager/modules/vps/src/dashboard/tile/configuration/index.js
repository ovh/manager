import angular from 'angular';
import 'angular-translate';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import upgradeModule from './upgrade';

import './index.scss';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerVpsDashboardTileConfiguration';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ngOvhTranslateAsyncLoader,
    upgradeModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
