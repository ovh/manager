import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.organisation.add', {
    url: '/add',
    resolve: {
      goBack: /* @ngInject */ (goToOrganisation) => goToOrganisation,
    },
    views: {
      modal: {
        component: 'ipOrganisationAddOrEdit',
      },
    },
    layout: 'modal',
  });

  $stateProvider.state('app.ip.organisation.edit', {
    url: '/edit',
    params: {
      organisation: {
        type: 'json',
        value: null,
      },
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('organisation')
        .then((organisation) =>
          isEmpty(organisation) ? 'app.ip.organisation' : null,
        );
    },
    resolve: {
      goBack: /* @ngInject */ (goToOrganisation) => goToOrganisation,
      organisation: /* @ngInject */ ($transition$) =>
        $transition$.params().organisation,
    },
    views: {
      modal: {
        component: 'ipOrganisationAddOrEdit',
      },
    },
    layout: 'modal',
  });
};
