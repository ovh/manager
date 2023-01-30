import angular from 'angular';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';
import passwordClipboard from '../password-clipboard';

const moduleName =
  'ovhManagerPciProjectsProjectStoragesComponentsUserCredentialBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', passwordClipboard])
  .component('storagesComponentsUserCredentialBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
