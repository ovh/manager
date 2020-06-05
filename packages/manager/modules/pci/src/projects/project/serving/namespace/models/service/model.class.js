import {
  PROCESSING_VERSION_STATUS,
  ERROR_VERSION_STATUS,
  VERSION_STATUS,
  API_STATUS,
} from '../models.constants';

export default class NamespaceModel {
  constructor({
    apiStatus,
    createdAt,
    id,
    replicas,
    storagePath,
    url,
    flavor,
    workflowTemplateParameters,
    autoscalingSpec,
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
      flavor,
      workflowTemplateParameters,
      autoscalingSpec,
      version,
      versionStatus,
    });
  }

  isInError() {
    return ERROR_VERSION_STATUS.includes(this.versionStatus);
  }

  isProcessing() {
    return PROCESSING_VERSION_STATUS.includes(this.versionStatus);
  }

  isDeployed() {
    return this.versionStatus === VERSION_STATUS.deployed;
  }

  isRunning() {
    return this.apiStatus === API_STATUS.running;
  }
}
