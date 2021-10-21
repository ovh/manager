export default class Volume {
  static createVolumeModel(
    mountPath = null,
    permission = null,
    cache = false,
    container = null,
    prefix = null,
  ) {
    return new Volume({
      mountPath,
      permission,
      cache,
      container,
      prefix,
    });
  }

  static createVolumeGitModel(
    mountPath = null,
    permission = null,
    cache = false,
    gitUrl = null,
  ) {
    return new Volume({
      mountPath,
      permission,
      cache,
      gitUrl,
    });
  }

  constructor(volumeModel) {
    Object.assign(this, volumeModel);
  }
}
