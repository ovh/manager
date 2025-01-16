export default class PciProjectStorageBucketVersioningController {
  handleBucketVersioningChange() {
    this.onBucketVersioningChange({
      versioning: this.isBucketVersioningEnabled
        ? { status: 'enabled' }
        : undefined,
    });
  }
}
