import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-zerto-onPremise-onPremisePccStep.component';

const moduleName = 'dedicatedCloudDatacenterZertoOnPremiseOnPremisePccModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations ../../../translations */);

export default moduleName;
