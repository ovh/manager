angular.module('managerApp')
  .config((uibDatepickerConfig) => {
    _.set(uibDatepickerConfig, 'showWeeks', false);
  });
