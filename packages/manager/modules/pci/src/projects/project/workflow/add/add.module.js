import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './add.component';
import generalInfo from './general';
import pciProjectsProjectInstanceService from '../../instances/instances.service';
import routing from './add.routing';
import resources from './resources';
import schedule from './schedule';
import workflowType from './type';

const moduleName = 'ovhManagerPciProjectWorkflowAddModule';

angular
  .module(moduleName, [
    generalInfo,
    resources,
    schedule,
    workflowType,
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
  ])
  .config(routing)
  .component('ovhManagerPciProjectWorkflowAdd', component)
  .service(
    'PciProjectsProjectInstanceService',
    pciProjectsProjectInstanceService,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
