import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';

import component from './user-identitiy-documents.component';
import routing from './user-identity-documents.routes';
import documentUploadValidationModalModule from './document-upload-validation-modal';
import uploadDocumentsProofTile from './components/identity-documents-proof-tile';
import uploadDocumentsDetail from './components/identity-documents-upload-detail';

const moduleName = 'DedicatedUserAccountIdentityDocuments';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhHttp,
    documentUploadValidationModalModule,
    uploadDocumentsProofTile,
    uploadDocumentsDetail,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedAccountUserIdentityDocuments', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
