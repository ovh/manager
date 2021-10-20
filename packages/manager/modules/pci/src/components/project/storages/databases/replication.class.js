import find from 'lodash/find';

export default class ServiceIntegration {
  constructor({
    id,
    sourceService,
    targetService,
    topics,
    topicExcludeList,
    syncGroupOffsets,
    syncInterval,
    heartbeatsEmit,
    replicationPolicyClass,
    enabled,
  }) {
    this.updateData({
      id,
      sourceService,
      targetService,
      topics,
      topicExcludeList,
      syncGroupOffsets,
      syncInterval,
      heartbeatsEmit,
      replicationPolicyClass,
      enabled,
    });
  }

  setServicesNames(replications) {
    this.serviceNameSource = find(replications, {
      serviceId: this.sourceService,
    })?.serviceName;
    this.serviceNameTarget = find(replications, {
      serviceId: this.targetService,
    })?.serviceName;
  }

  updateData({
    id,
    sourceService,
    targetService,
    topics,
    topicExcludeList,
    syncGroupOffsets,
    syncInterval,
    heartbeatsEmit,
    replicationPolicyClass,
    enabled,
  }) {
    Object.assign(this, {
      id,
      sourceService,
      targetService,
      topics,
      topicExcludeList,
      syncGroupOffsets,
      syncInterval,
      heartbeatsEmit,
      replicationPolicyClass,
      enabled,
    });
  }
}
