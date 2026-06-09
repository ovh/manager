import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import addSiteModule from '../../addSite';
import deleteSiteModalModule from '../../listing/delete-site-modal';
import deleteModule from './delete';
import component from './dedicatedCloud-datacenter-zerto-drp-configuration.component';

const moduleName = 'dedicatedCloudDatacenterZertoDrpConfigurationModule';

angular
  .module(moduleName, [
    addSiteModule,
    deleteSiteModalModule,
    deleteModule,
    'dedicatedCloudDatacenterZertoStateBadgeModule',
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
