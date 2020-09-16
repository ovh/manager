import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-create.component';
import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesCreate';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .component(component.name, component)
  .config(routing);

export default moduleName;
