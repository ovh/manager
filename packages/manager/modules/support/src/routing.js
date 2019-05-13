import template from './template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('support', {
      resolve: {
        me: /* @ngInject */ OvhApiMe => OvhApiMe.v6().get().$promise,
      },
      url: '/support',
      template,
    });
};
