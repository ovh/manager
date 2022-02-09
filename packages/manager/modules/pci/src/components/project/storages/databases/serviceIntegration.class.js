import find from 'lodash/find';
import { DATABASE_TYPES } from '../../../../projects/project/storages/databases/databases.constants';
import Base from './base.class';
import { INTEGRATION_TYPE } from './serviceIntegration.constants';

export default class ServiceIntegration extends Base {
  constructor({ id, sourceServiceId, destinationServiceId, status, type }) {
    super();
    this.updateData({
      id,
      sourceServiceId,
      destinationServiceId,
      status,
      type,
    });
  }

  setSourceServiceName(serviceList) {
    this.sourceServiceName = find(serviceList, {
      id: this.sourceServiceId,
    })?.description;
  }

  setDestinationServiceName(serviceList) {
    this.destinationServiceName = find(serviceList, {
      id: this.destinationServiceId,
    })?.description;
  }

  getTargetEngine() {
    switch (this.type) {
      case INTEGRATION_TYPE.MIRROR_MAKER:
        return DATABASE_TYPES.KAFKA_MIRROR_MAKER;
      case INTEGRATION_TYPE.KAFKA_CONNECT:
        return DATABASE_TYPES.KAFKA_CONNECT;
      case INTEGRATION_TYPE.M3_AGGREGATOR:
        return DATABASE_TYPES.M3AGGEGATOR;
      default:
        return null;
    }
  }

  updateData({ id, sourceServiceId, destinationServiceId, status, type }) {
    Object.assign(this, {
      id,
      sourceServiceId,
      destinationServiceId,
      status,
      type,
    });
  }
}
