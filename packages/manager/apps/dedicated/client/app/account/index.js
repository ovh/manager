import contacts from './contacts';
import contactUpdate from './contacts/update';
import redirection from './account.redirection';
import routing from './account.routing';
import user from './user';
import identityDocuments from './identity-documents';
import kycDocuments from './kyc-documents';

const moduleName = 'ovhManagerAppAccount';

angular
  .module(moduleName, [
    contacts,
    contactUpdate,
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    user,
    identityDocuments,
    kycDocuments,
  ])
  .config(redirection)
  .config(routing);

export default moduleName;
