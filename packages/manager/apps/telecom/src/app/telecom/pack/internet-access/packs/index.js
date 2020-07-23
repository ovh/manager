import angular from 'angular';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import routing from './packs.routing';

const moduleName = 'ovhManagerTelecomPackInternetAccessPacks';

angular
  .module(moduleName, [ListLayoutHelper.moduleName])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
