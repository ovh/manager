import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import snapshotCreateVolume from './create-volume';

import routing from './snapshot.routing';

const moduleName = 'ovhManagerPciStoragesSnapshotsSnapshot';

angular
  .module(moduleName, [
    snapshotCreateVolume,
    'ui.router',
    'oc.lazyLoad',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
