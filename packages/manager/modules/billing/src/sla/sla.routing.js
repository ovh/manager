import controller from './billing-sla.controller';
import template from './billing-sla.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.sla', {
    url: '/sla',
    template,
    controller,
    translations: { value: ['..'], format: 'json' },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
