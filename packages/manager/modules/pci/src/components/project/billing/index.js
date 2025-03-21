import angular from 'angular';

import archiveStorageList from './archive-storage-list';
import details from './details';
import detailsPopover from './details-popover';
import hourlyResourceList from './hourly-resource-list';
import instanceList from './instance-list';
import monthlyResourceList from './monthly-resource-list';
import objectStorageList from './object-storage-list';
import outgoingTrafic from './outgoing-trafic';
import snapshotList from './snapshot-list';
import volumeList from './volume-list';
import resourceUsageList from './resource-usage';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular.module(moduleName, [
  archiveStorageList,
  details,
  detailsPopover,
  hourlyResourceList,
  instanceList,
  monthlyResourceList,
  objectStorageList,
  outgoingTrafic,
  snapshotList,
  volumeList,
  resourceUsageList,
]);

export default moduleName;
