export default class PciProjectStorageBucketVersioningController {
  $onInit() {
    this.isBucketVersioningEnabled = false;
  }

  handleBucketVersioningChange() {
    this.onBucketVersioningChange({
      versioning: this.isBucketVersioningEnabled
        ? { status: 'enabled' }
        : undefined,
    });
  }
}
