import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';
import dashboardTile from './dashboard-tile';
import listModal from './list-modal';
import tagManager from './manager';
import assignModal from './assign-tags-modal';
import unassignModal from './unassign-tags-modal';
import component from './component';
import service from './service';

const moduleName = 'ovhManagerResourceTagging';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    ApiV2ListHelper.moduleName,
    dashboardTile,
    listModal,
    tagManager,
    assignModal,
    unassignModal,
  ])
  .component('ovhManagerResourceTagging', component)
  .service('ovhManagerResourceTaggingService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
