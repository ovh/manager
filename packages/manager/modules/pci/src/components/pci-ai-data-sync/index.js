import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './pci-ai-data-sync.component';
import appService from '../../projects/project/ai/ai.service';
import notebookService from '../../projects/project/notebooks/notebooks.service';
import jobService from '../../projects/project/training/job.service';

const moduleName = 'ovhManagerPciAiDataSyncComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPciProjectAiDataSync', component)
  .service('PciProjectAppService', appService)
  .service('PciProjectNotebookService', notebookService)
  .service('PciProjectJobService', jobService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
