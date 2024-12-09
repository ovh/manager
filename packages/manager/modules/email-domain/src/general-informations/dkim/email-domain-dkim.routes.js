export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.information.dkim', {
    url: '/dkim',
    layout: 'modal',
    views: {
      modal: {
        component: 'emailDomainDkimComponent',
      },
    },
    params: {
      dkim: null,
    },
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ ($state, setMessage, serviceName) => (
        message,
        type = 'success',
        reload = false,
      ) => {
        const promise = $state.go(
          'app.email.domain.information',
          { productId: serviceName },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => setMessage(message, type));
        }

        return promise;
      },
      setMessage: /* @ngInject */ (Alerter, $timeout) => (message, type) =>
        $timeout(() => Alerter.set(`alert-${type}`, message, null), 1000),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      dkim: /* @ngInject */ ($transition$, WucEmails, serviceName) =>
        !$transition$.params().dkim
          ? WucEmails.getDkim(serviceName).then((dkim) => dkim)
          : $transition$.params().dkim,
    },
  });
};
