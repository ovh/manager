import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './download-rclone.component';
import module from './download-rclone.module';

const moduleName = 'ovhManagerPciComponentsUsersDownloadRClone';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', module])
  .component('pciProjectUsersDownloadRclone', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
