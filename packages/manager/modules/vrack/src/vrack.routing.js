import template from './vrack.html';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('vrack-home', {
    url: '/vrack',
    template,
    controller: 'VrackCtrl',
    controllerAs: 'VrackCtrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
  }).state('vrack', {
    url: '/vrack/:vrackId',
    template,
    controller: 'VrackCtrl',
    controllerAs: 'VrackCtrl',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
