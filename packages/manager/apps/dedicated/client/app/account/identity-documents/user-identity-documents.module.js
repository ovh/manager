import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';

import component from './user-identitiy-documents.component';
import routing from './user-identity-documents.routes';
import uploadConfirmModule from './upload-identity-documents-confirm';
import uploadCorporationRequirements from './components/identity-documents-corporation';
import uploadIndividualRequirements from './components/identity-documents-individual';

const moduleName = 'DedicatedUserAccountIdentityDocuments';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhHttp,
    uploadConfirmModule,
    uploadCorporationRequirements,
    uploadIndividualRequirements,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedAccountUserIdentityDocuments', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
