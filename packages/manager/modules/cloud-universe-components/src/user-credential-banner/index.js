import angular from 'angular';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import component from './component';
import passwordClipboard from '../field-clipboard';

const moduleName =
  'cucPciProjectsProjectStoragesComponentsUserCredentialBanner';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', passwordClipboard])
  .component(
    'cucPciProjectsProjectStoragesComponentsUserCredentialBanner',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
