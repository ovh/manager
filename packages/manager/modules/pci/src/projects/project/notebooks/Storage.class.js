export default class Storage {
  static createStorageModel(
    id = null,
    container = null,
    mountPath = null,
    permission = null,
  ) {
    return new Storage({
      id,
      container,
      mountPath,
      permission,
    });
  }

  constructor(storageModel) {
    Object.assign(this, storageModel);
  }
}
