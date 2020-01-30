export default class {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  $onInit() {
    this.userAccessPolicyIsCorrect =
      this.currentService.userAccessPolicy === 'FILTERED';
    this.numberOfAllowedIPsAndBlocksIsAllowed =
      this.allowedIPsAndBlocks.length > 0;
    this.configurationIsCorrect =
      this.userAccessPolicyIsCorrect &&
      this.numberOfAllowedIPsAndBlocksIsAllowed;
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
