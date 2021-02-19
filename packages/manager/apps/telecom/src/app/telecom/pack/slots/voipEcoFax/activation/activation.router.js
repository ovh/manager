import controller from './activation.controller';
import template from './activation.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipEcoFax-activation', {
    url: '/voipEcoFax/activation',
    template,
    controller,
    controllerAs: 'PackFaxActivationCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('fax_activation_widget-title'),
    },
  });
};
