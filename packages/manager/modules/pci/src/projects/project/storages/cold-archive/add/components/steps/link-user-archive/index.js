import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName =
  'ovhManagerPciProjectsProjectStoragesColdArchiveAddStepLinkUserArchive';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('coldArchiveLinkUserArchive', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
