angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.domain.rule', {
    url: '/rule',
    views: {
      cdnDomainView: {
        templateUrl: 'cdn/dedicated/domain/rule/cdn-dedicated-domain-rule.html',
        controller: 'CdnDomainTabCacheRuleCtrl',
        controllerAs: '$ctrl',
      },
    },
  });
});
