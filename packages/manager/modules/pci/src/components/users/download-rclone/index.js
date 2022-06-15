import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './download-rclone.component';

const moduleName = 'ovhManagerPciComponentsUsersDownloadRClone';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('pciProjectUsersDownloadRclone', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
