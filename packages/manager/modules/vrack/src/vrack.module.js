import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';
import service from './dashboard/vrack.service';

const moduleName = 'ovhManagerVRack';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
    ApiV2ListHelper.moduleName,
  ])
  .service('vrackService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
