import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';

import component from './user-identitiy-documents.component';
import routing from './user-identity-documents.routes';
import uploadConfirmModule from './upload-identity-documents-confirm';

const moduleName = 'DedicatedUserAccountIdentityDocuments';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhHttp,
    uploadConfirmModule,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedAccountUserIdentityDocuments', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
