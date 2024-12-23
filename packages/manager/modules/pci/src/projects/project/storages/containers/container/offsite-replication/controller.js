export default class PciProjectStorageOffsiteReplicationController {
  $onInit() {
    // this.isOffsiteReplicationEnabled = true;
    console.log(
      'this.isOffsiteReplicationEnabled 10',
      this.isOffsiteReplicationEnabled,
    );
  }

  handleOffsiteReplicationChange() {
    this.onOffsiteReplicationChange({
      replication: this.isOffsiteReplicationEnabled
        ? {
            rules: [
              {
                id: '',
                status: 'enabled',
                priority: 1,
                deleteMarkerReplication: 'disabled',
              },
            ],
          }
        : undefined,
    });
  }
}
