import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './ssh-key-selector.component';
import service from './ssh-key-selector.service';

const moduleName = 'ovhManagerComponentsSshKey';

angular
  .module(moduleName, ['oui'])
  .component('sshKeySelector', component)
  .service('SshKeySelectorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
