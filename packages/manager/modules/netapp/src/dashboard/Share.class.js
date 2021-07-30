export default class Share {
  constructor({ id, createdAt, description, name, protocol, size, status }) {
    Object.assign(this, {
      id,
      createdAt,
      description,
      name,
      protocol,
      size,
      status,
    });
  }

  isAvailable() {
    return this.status === 'available';
  }

  isUnavailable() {
    return (
      this.isDeleting() ||
      this.isDeleted() ||
      this.isInactive() ||
      this.isBusy()
    );
  }

  isDeleting() {
    return this.status === 'deleting';
  }

  isDeleted() {
    return this.status === 'deleted';
  }

  isInactive() {
    return this.status === 'inactive';
  }

  isUnmanaged() {
    return this.status === 'unmanaged';
  }

  isBusy() {
    return [
      'manage_starting',
      'unmanage_starting',
      'extending',
      'shrinking',
      'migrating',
      'reverting',
      'migrating_to',
      'replication_change',
    ].includes(this.status);
  }

  isCreating() {
    return ['creating', 'creating_from_snapshot'].includes(this.status);
  }

  hasError() {
    return [
      'error',
      'error_deleting',
      'manage_error',
      'unmanage_error',
      'extending_error',
      'shrinking_error',
      'shrinking_possible_data_loss_error',
      'reverting_error',
    ].includes(this.status);
  }
}
