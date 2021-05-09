import get from 'lodash/get';
import set from 'lodash/set';
import { STATUS, OFFER_NAME } from './web-paas.constants';
import Plan from './plan.class';

export default class Project {
  constructor({
    addons,
    offer,
    metadata,
    partnerProjectId,
    projectName,
    serviceId,
    startDate,
    offerName,
    status,
  }) {
    Object.assign(this, {
      addons,
      offer,
      offerName,
      metadata,
      partnerProjectId,
      projectName,
      serviceId,
      startDate,
      status,
    });
    this.setOfferName();
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isError() {
    return [STATUS.SUSPENDED, STATUS.ERROR].includes(this.status);
  }

  isProcessing() {
    return [STATUS.PENDING, STATUS.CANCELLING].includes(this.status);
  }

  getAvailableUserLicenses() {
    return get(this, 'metadata.project.availableUserLicenses');
  }

  getAvailableEnvironments() {
    return get(this, 'metadata.project.availableEnvironments');
  }

  getTotalLicences() {
    return get(this, 'metadata.project.userLicenses');
  }

  getTotalStorage() {
    return get(this, 'metadata.project.storage');
  }

  getVcpu() {
    return get(this, 'metadata.project.vcpu');
  }

  getTotalEnvironment() {
    return get(this, 'metadata.project.environment');
  }

  setSelectedPlan(plan) {
    set(this, 'selectedPlan', new Plan(plan));
  }

  setOfferName() {
    set(this, 'offerName', OFFER_NAME[this.offer.split('-')[0]]);
  }

  getRegion() {
    return get(this, 'metadata.project.region');
  }
}
