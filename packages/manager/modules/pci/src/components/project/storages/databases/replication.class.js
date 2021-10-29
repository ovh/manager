import find from 'lodash/find';

export default class ServiceIntegration {
  constructor({
    id,
    sourceIntegration,
    targetIntegration,
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
      sourceIntegration,
      targetIntegration,
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
    this.integrationNameSource = find(replications, {
      id: this.sourceIntegration,
    })?.destinationServiceName;
    this.integrationNameTarget = find(replications, {
      id: this.targetIntegration,
    })?.destinationServiceName;
  }

  updateData({
    id,
    sourceIntegration,
    targetIntegration,
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
      sourceIntegration,
      targetIntegration,
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
