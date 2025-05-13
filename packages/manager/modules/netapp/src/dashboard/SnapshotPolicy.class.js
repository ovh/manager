export default class SnapshotPolicy {
  constructor({ id, name, description, createdAt, isDefault, status, rules }) {
    Object.assign(this, {
      id,
      name,
      description,
      createdAt,
      isDefault,
      rules,
      status,
    });
  }

  isAvailable() {
    return this.status === 'available';
  }

  isDeleting() {
    return this.status === 'deleting';
  }

  isUpdating() {
    return this.status === 'updating';
  }

  isInError() {
    return this.status === 'error';
  }

  isCreating() {
    return this.status === 'creating';
  }
}
