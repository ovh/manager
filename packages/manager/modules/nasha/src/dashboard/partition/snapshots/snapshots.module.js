import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import deleteModule from './delete';

import component from './snapshots.component';
import routing from './snapshots.routing';
import './snapshots.styles.scss';

const moduleName = 'ovhManagerNashaDashboardPartitionSnapshots';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui', deleteModule])
  .component('nashaDashboardPartitionSnapshots', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
