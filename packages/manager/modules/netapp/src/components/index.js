import angular from 'angular';

import selectCheckboxes from './select-checkboxes';
import snapshotList from './snapshot-policies';

const moduleName = 'ovhManagerNetAppComponents';

angular.module(moduleName, [selectCheckboxes, snapshotList]);

export default moduleName;
