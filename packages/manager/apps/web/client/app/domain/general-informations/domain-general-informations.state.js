import template from './GENERAL_INFORMATIONS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.information', {
    url: '/information',
    views: {
      domainView: {
        template,
        controller: 'DomainTabGeneralInformationsCtrl',
      },
    },
    atInternet: {
      rename: 'GENERAL_INFORMATIONS',
    },
    resolve: {
      goToDashboard: /* @ngInject */ (
        $state,
        Alerter,
      ) => (message = false, type = 'success') => {
        const promise = $state.go('app.domain.product.information');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });

  $stateProvider.state('app.domain.alldom.information', {
    url: '/information',
    views: {
      domainView: {
        template,
        controller: 'DomainTabGeneralInformationsCtrl',
      },
    },
    atInternet: {
      rename: 'GENERAL_INFORMATIONS',
    },
    resolve: {
      goToDashboard: /* @ngInject */ (
        $state,
        Alerter,
      ) => (message = false, type = 'success') => {
        const promise = $state.go('app.domain.alldom.information');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });
};
