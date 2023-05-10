import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import fieldClipboardComponent from './field-clipboard';
import userCredentialBannerComponent from './user-credential-banner';
import detachVolumeBannerComponent from './detach-volume-banner';

const moduleName = 'ovhManagerPciStoragesComponents';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    fieldClipboardComponent,
    userCredentialBannerComponent,
    detachVolumeBannerComponent,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
