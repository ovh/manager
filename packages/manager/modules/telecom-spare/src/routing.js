import template from './template.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare', {
      url: '/spare',
      views: {
        '': {
          template,
        },
      },
      abstract: true,
      redirectTo: 'spare.modems',
      resolve: {
        me: /* @ngInject */ OvhApiMe => OvhApiMe.v6().get().$promise,
      },
    });
};
