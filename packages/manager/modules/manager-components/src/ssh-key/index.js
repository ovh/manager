import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './ssh-key.component';
import service from './ssh-key.service';

const moduleName = 'ovhManagerComponentsSshKey';

angular
  .module(moduleName, ['oui'])
  .component('sshKey', component)
  .service('SshKeyService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
