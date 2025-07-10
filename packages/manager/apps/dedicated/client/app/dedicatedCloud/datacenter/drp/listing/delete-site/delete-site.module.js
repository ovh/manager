import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';
import deleteSiteModal from '../../../../../components/dedicated-cloud/datacenter/drp/listing/delete-site-modal';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './delete-site.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpDeleteSiteModule';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
    deleteSiteModal,
  ])
  .config(routing);

export default moduleName;
