import template from './DOMAIN.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.product.domain', {
    url: '/domain',
    template,
    controller: 'SharepointDomainsCtrl',
    controllerAs: 'domainsCtrl',
  });
};
