import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import zertoSiteStateComponent from '../stateBadge';

import component from './dedicatedCloud-datacenter-zerto-listing.component';

const moduleName = 'dedicatedCloudDatacenterZertoListingModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    zertoSiteStateComponent,
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
