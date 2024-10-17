import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './ssh-key-selector.component';
import service from './ssh-key-selector.service';

const moduleName = 'ovhManagerComponentsSshKeySelector';

angular
  .module(moduleName, ['oui'])
  .component('ovhManagerSshKeySelector', component)
  .service('SshKeySelectorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
