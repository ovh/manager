
import { PROCESSING_VERSION_STATUS, ERROR_VERSION_STATUS } from './models.constants';

export default class Model {
  constructor({
    apiStatus,
    createdAt,
    id,
    replicas,
    storagePath,
    url,
    version,
    versionStatus,
  }) {
    Object.assign(this, {
      apiStatus,
      createdAt,
      id,
      replicas,
      storagePath,
      url,
      version,
      versionStatus,
    });
  }

  versionError() {
    return ERROR_VERSION_STATUS.includes(this.versionStatus);
  }

  versionProcessing() {
    return PROCESSING_VERSION_STATUS.includes(this.versionStatus);
  }
}
