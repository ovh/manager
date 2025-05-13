import angular from 'angular';

import routing from './cda-details-home';
import cdaDetailComponent from './detail/cda-detail.component';
import cdaDetailEditCtrl from './detail/edit/cda-detail-edit.controller';
import cdaHealthComponent from './health/cda-health.component';
import cdaSpaceUsageComponent from './space-usage/cda-space-usage.component';
import cdaTasksComponent from './tasks/cda-tasks.component';

import './detail/cda-detail.component.less';

const moduleName = 'ovhManagerCdaDetailsHome';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cdaDetail', cdaDetailComponent)
  .component('cdaHealth', cdaHealthComponent)
  .component('cdaSpaceUsage', cdaSpaceUsageComponent)
  .component('cdaTasks', cdaTasksComponent)
  .controller('CdaDetailEditCtrl', cdaDetailEditCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
