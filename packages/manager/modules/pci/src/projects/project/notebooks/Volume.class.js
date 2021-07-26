export default class Volume {
  static createVolumeModel(
    container = null,
    mountPath = null,
    permission = null,
  ) {
    return new Volume({
      container,
      mountPath,
      permission,
    });
  }

  constructor(volumeModel) {
    Object.assign(this, volumeModel);
  }
}
