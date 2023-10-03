import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import './logs-streams.less';

import add from './add/add.module';
import archives from './archives/archives.module';
import alerts from './alerts/alerts.module';
import component from './streams.component';
import edit from './edit/edit.module';
import follow from './follow/follow.module';
import home from './home/home.module';
import routing from './streams.routing';
import service from './logs-streams.service';
import subscriptions from './subscriptions/subscriptions.module';

const moduleName = 'ovhManagerDbaasLogsDetailStreams';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    alerts,
    archives,
    edit,
    follow,
    home,
    subscriptions,
  ])
  .config(routing)
  .service('LogsStreamsService', service)
  .component('dbaasLogsDetailStreams', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
