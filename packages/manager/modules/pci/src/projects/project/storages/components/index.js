import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import passwordClipboardComponent from './password-clipboard';

const moduleName = 'ovhManagerPciStoragesComponents';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    passwordClipboardComponent,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
