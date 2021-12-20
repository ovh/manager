export default class Volume {
  static createVolumeModel(
    mountPath = null,
    permission = null,
    cache = false,
    container = null,
    prefix = null,
    privateSwift = true,
  ) {
    return new Volume({
      mountPath,
      permission,
      cache,
      container,
      prefix,
      privateSwift,
    });
  }

  static createVolumeGitModel(
    mountPath = null,
    permission = null,
    gitUrl = null,
    publicGit = true,
  ) {
    return new Volume({
      mountPath,
      permission,
      gitUrl,
      publicGit,
    });
  }

  constructor(volumeModel) {
    Object.assign(this, volumeModel);
  }
}
