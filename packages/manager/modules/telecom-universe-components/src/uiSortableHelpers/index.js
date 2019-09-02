import angular from 'angular';

import { TUC_UI_SORTABLE_HELPERS } from './uiSortableHelpersVariableHeightTolerance';

const moduleName = 'tucUiSortableHelpers';

angular
  .module(moduleName, [])
  .constant('TUC_UI_SORTABLE_HELPERS', TUC_UI_SORTABLE_HELPERS);

export default moduleName;
