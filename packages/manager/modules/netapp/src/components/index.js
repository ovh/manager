import angular from 'angular';

import selectCheckboxes from './select-checkboxes';
import snapshotList from './snapshot-policies';
import replicationsModal from './replications-modal';

const moduleName = 'ovhManagerNetAppComponents';

angular.module(moduleName, [selectCheckboxes, snapshotList, replicationsModal]);

export default moduleName;
