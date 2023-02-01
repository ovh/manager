import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import component from './users.component';
import routing from './users.routing';
import deleteUser from './delete';
import importPolicy from './import';
import downloadRclone from './download-rclone';
import addUser from './add';
import credentialBanner from '../../components/user-credential-banner';

const moduleName = 'ovhManagerPciStoragesColdArchiveUserList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    credentialBanner,
    deleteUser,
    importPolicy,
    downloadRclone,
    addUser,
  ])
  .component('pciProjectStorageColdArchiveUsers', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
