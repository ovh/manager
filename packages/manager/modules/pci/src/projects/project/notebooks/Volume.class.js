export default class Volume {
  static createVolumeModel(
    container = null,
    mountPath = null,
    permission = null,
    swiftVolume = true,
  ) {
    return new Volume({
      container,
      mountPath,
      permission,
      swiftVolume,
    });
  }

  static createVolumeGitModel(
    url = null,
    mountPath = null,
    permission = null,
    gitVolume = true,
  ) {
    return new Volume({
      url,
      mountPath,
      permission,
      gitVolume,
    });
  }

  constructor(volumeModel) {
    Object.assign(this, volumeModel);
  }
}
