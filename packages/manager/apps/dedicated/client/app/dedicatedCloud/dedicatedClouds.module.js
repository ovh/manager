import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import dedicatedCloudTerminateComponent from '../components/dedicated-cloud/terminate';

import routing from './dedicatedClouds.routing';
import dedicatedCloudListComponent from '../components/dedicated-cloud/list';
import dedicatedCloudService from '../components/dedicated-cloud/dedicatedCloud.service';
import IcebergUtils from '../icebergUtils.services';

const moduleName = 'ovhManagerDedicatedCloud';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
    dedicatedCloudService,
    dedicatedCloudListComponent,
    dedicatedCloudTerminateComponent,
    IcebergUtils,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
