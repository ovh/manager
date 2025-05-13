import angular from 'angular';

import editNameModule from './edit-name';
import metricsModule from './metrics';
import spaceMeterModule from './space-meter';
import partitionModule from './partition';
import taskTrackerModule from './task-tracker';
import eolLv1Lv2ServicesBannerModule from './eol-lv1-lv2-banner';

const moduleName = 'ovhManagerNashaComponents';

angular.module(moduleName, [
  editNameModule,
  spaceMeterModule,
  metricsModule,
  partitionModule,
  taskTrackerModule,
  eolLv1Lv2ServicesBannerModule,
]);

export default moduleName;
