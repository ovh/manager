import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import routing from './exchange.routing';

const moduleName = 'ovhManagerExchange';

angular
  .module(moduleName, [
    ngOvhChart,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
  ])
  .config(routing);

export default moduleName;
