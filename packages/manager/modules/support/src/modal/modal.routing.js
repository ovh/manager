import illustration from '../assets/images/preview.png';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('support.tickets.beta-help-center', {
    url: '/betaHelpCenter',
    views: {
      modal: {
        component: 'modalBetaHelpcenter',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      illustration: /* @ngInject */ () => illustration,
    },
  });
};
