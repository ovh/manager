import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './add.component';
import routing from './add.routing';
import workflowType from './type';
import resources from './resources';
import schedule from './schedule';
import generalInfo from './general';
import PciProjectsProjectInstanceService from '../../instances/instances.service';

const moduleName = 'ovhManagerPciProjectWorkflowAddModule';

angular.module(moduleName, [
  workflowType,
  resources,
  schedule,
  generalInfo,
  'ngOvhCloudUniverseComponents',
  'ngOvhSwimmingPoll',
  'oui',
  'ovh-api-services',
])
  .config(routing)
  .component('ovhManagerPciProjectWorkflowAdd', component)
  .service('PciProjectsProjectInstanceService', PciProjectsProjectInstanceService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
