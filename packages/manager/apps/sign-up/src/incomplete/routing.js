import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sign-up.incomplete', {
    url: 'incomplete',
    views: {
      '@': {
        component: component.name,
      },
    },
    resolve: {
      finishHref: /* @ngInject */ ($state) => $state.href('sign-up'),
    },
  });
};