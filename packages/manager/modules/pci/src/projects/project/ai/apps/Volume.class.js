export default class Volume {
  static createVolumeModel(
    mountPath = null,
    permission = null,
    cache = false,
    container = null,
    prefix = null,
    dataStore = true,
  ) {
    return new Volume({
      mountPath,
      permission,
      cache,
      container,
      prefix,
      dataStore,
    });
  }

  static createVolumeGitModel(
    mountPath = null,
    permission = null,
    cache = false,
    gitUrl = null,
    publicGit = true,
  ) {
    return new Volume({
      mountPath,
      permission,
      cache,
      gitUrl,
      publicGit,
    });
  }

  constructor(volumeModel) {
    Object.assign(this, volumeModel);
  }
}
