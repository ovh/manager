import set from 'lodash/set';

angular.module('managerApp').config((uibDatepickerConfig) => {
  set(uibDatepickerConfig, 'showWeeks', false);
});
