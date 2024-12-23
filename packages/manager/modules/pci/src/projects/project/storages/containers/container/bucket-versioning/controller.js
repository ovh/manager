export default class PciProjectStorageBucketVersioningController {
  // $onInit() {
  //   // this.isBucketVersioningEnabled = this.forceEnableVersionning;
  // }

  handleBucketVersioningChange() {
    this.onBucketVersioningChange({
      versioning: this.isBucketVersioningEnabled
        ? { status: 'enabled' }
        : undefined,
    });
  }
}
