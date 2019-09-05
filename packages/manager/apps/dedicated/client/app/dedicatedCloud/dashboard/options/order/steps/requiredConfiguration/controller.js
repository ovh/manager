export default class DedicatedCloudCertificationActivationRequiredConfiguration {
  /* @ngInject */
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    this.userAccessPolicyIsCorrect = this.currentService.userAccessPolicy === 'FILTERED';
    this.numberOfAllowedIPsAndBlocksIsAllowed = this.allowedIPsAndBlocks.length > 0;
    this.configurationIsCorrect = this.userAccessPolicyIsCorrect
      && this.numberOfAllowedIPsAndBlocksIsAllowed;
  }

  mapAllowedIPsAndBlocks() {
    return this.$q.when({
      data: this.allowedIPsAndBlocks,
      meta: {
        totalCount: this.allowedIPsAndBlocks.length,
      },
    });
  }
}
