import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import component from './users.component';
import credentialBanner from '../component/credential-banner';
import routing from './users.routing';
import deleteUser from './delete';
import importPolicy from './import';
import downloadRclone from './download-rclone';
import addUser from './add';

const moduleName = 'ovhManagerPciStoragesObjectStorageUserList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    deleteUser,
    importPolicy,
    downloadRclone,
    addUser,
  ])
  .component('pciProjectStorageObjectStorageUsers', component, credentialBanner)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
