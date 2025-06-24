import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';

import routing from './iam-policies.routing';
import component, { name as componentName } from './iam-policies.component';
import service, { name as serviceName } from './iam-policies.service';

const moduleName = 'ovhManagerDbaasLogsDetailIAMPolicies';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    ApiV2ListHelper.moduleName,
  ])
  .component(componentName, component)
  .service(serviceName, service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
