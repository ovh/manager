import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import add from './add';
import deleteUser from './delete';
import downloadOpenRc from './download-openrc';
import downloadRclone from './download-rclone';
import edit from './edit';
import onboarding from './onboarding';
import openstackToken from './openstack-token';
import usersComponent from '../../../components/project/users';

import routing from './users.routing';
import service from './users.service';

const moduleName = 'ovhManagerPciUsers';

angular
  .module(moduleName, [
    add,
    deleteUser,
    downloadOpenRc,
    downloadRclone,
    edit,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    onboarding,
    openstackToken,
    'ovh-api-services',
    'ui.router',
    usersComponent,
  ])
  .config(routing)
  .service('PciProjectsProjectUsersService', service);

export default moduleName;
