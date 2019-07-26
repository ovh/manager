export default class HeaderController {
  /* @ngInject */
  constructor(ovhUserPref, $rootScope, $translate) {
    this.ovhUserPref = ovhUserPref;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  hideSelfAndDisplayDomainConfiguration() {
    this.displayComponent({ componentName: 'domain-configuration' });
  }
}
