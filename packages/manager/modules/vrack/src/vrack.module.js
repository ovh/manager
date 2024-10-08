import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import service from './dashboard/vrack.service';
import routing from './vrack.routing';

const moduleName = 'ovhManagerVRack';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
  ])
  .service('vrackService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
