import controller from './email-domain-general-informations.controller';
import template from './email-domain-general-informations.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.information', {
    url: '',
    template,
    controller,
    controllerAs: 'ctrlTabGeneralInformations',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
