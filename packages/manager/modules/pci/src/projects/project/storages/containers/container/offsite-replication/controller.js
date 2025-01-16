export default class PciProjectStorageOffsiteReplicationController {
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
