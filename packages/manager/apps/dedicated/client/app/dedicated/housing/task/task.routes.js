import template from './dedicated-housing-task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicated-housing.dashboard.task', {
    url: '/task',
    template,
    controller: 'HousingTaskCtrl',
    controllerAs: '$ctrl',
  });
};
