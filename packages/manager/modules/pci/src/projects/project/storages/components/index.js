import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import passwordClipboardComponent from './password-clipboard';
import detachVolumeBannerComponent from './detach-volume-banner';

const moduleName = 'ovhManagerPciStoragesComponents';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    passwordClipboardComponent,
    detachVolumeBannerComponent,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
