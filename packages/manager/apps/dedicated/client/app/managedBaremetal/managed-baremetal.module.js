import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './managed-baremetal.routing';
import dedicatedCloudListComponent from '../components/dedicated-cloud/list';
import dedicatedCloudService from '../components/dedicated-cloud/dedicatedCloud.service';

const moduleName = 'ovhManagerManagedBaremetal';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
    dedicatedCloudService,
    dedicatedCloudListComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
