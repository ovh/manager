import angular from 'angular';

import selectCheckboxes from './select-checkboxes';
import snapshotList from './snapshot-policies';
import replicationsApprouveModal from './replications-approuve-modal';
import replicationsPromoteModal from './replications-promote-modal';
import replicationsDeleteModal from './replications-delete-modal';

const moduleName = 'ovhManagerNetAppComponents';

angular.module(moduleName, [
  selectCheckboxes,
  snapshotList,
  replicationsApprouveModal,
  replicationsPromoteModal,
  replicationsDeleteModal,
]);

export default moduleName;
