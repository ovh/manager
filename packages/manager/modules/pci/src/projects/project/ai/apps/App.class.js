import merge from 'lodash/merge';
import set from 'lodash/set';
import 'moment';

import {
  APP_STATES,
  APP_STATUS,
  APP_STORAGE_INFO,
  APP_TAGS,
} from './app.constants';

export default class App {
  /**
   * Create a App instance
   * @param app {Object}: native JS object
   * @param ovhSubsidiary {String|undefined}: (optional) used to get link info
   * @param regionInfo {Object|undefined}: (optional) data from ovhManagerRegionService.getRegion()
   * */
  constructor(
    { createdAt, id, spec, status, updatedAt, user },
    ovhSubsidiary,
    regionInfo,
  ) {
    this.updateData({
      createdAt,
      id,
      spec,
      status,
      updatedAt,
      user,
    });
    this.ovhSubsidiary = ovhSubsidiary;
    this.regionInfo = regionInfo;

    this.spec.labels = Object.keys(this.labels).map((labelKey) =>
      App.generateLabel(labelKey, this.labels[labelKey]),
    );
  }

  /**
   * Generate a label
   */
  static generateLabel(id = null, title = null) {
    return { title: `${id}=${title}` };
  }

  isStarting() {
    return this.status?.state === APP_STATUS.QUEUED;
  }

  isRunning() {
    return this.status?.state === APP_STATUS.RUNNING;
  }

  isScaling() {
    return this.status?.state === APP_STATUS.SCALING;
  }

  isPending() {
    return this.isStarting() || this.isScaling();
  }

  isStopped() {
    return this.status?.state === APP_STATUS.STOPPED;
  }

  isStoppable() {
    return [
      APP_STATUS.QUEUED,
      APP_STATUS.INITIALIZING,
      APP_STATUS.SCALING,
      APP_STATUS.RUNNING,
    ].includes(this.status?.state);
  }

  getLabelIndex(label) {
    return this.labels.findIndex((l) => l.id === label.id);
  }

  removeLabel(label) {
    const labelIndex = this.getLabelIndex(label);
    if (labelIndex >= 0) {
      this.labels.splice(labelIndex, 1);
    }
  }

  simulateRemoveLabel(label) {
    const labels = [...this.labels];
    const labelIndex = this.getLabelIndex(label);
    if (labelIndex >= 0) {
      labels.splice(labelIndex, 1);
    }

    return labels;
  }

  addLabel(label) {
    const labelIndex = this.getLabelIndex(label);
    if (labelIndex >= 0) {
      this.removeLabel(label);
    }

    this.labels.push(label);
  }

  convertLabels(labels = null) {
    return (labels || this.labels).reduce(
      (accumulator, label) => ({ ...accumulator, [label.id]: label.title }),
      {},
    );
  }

  setState(state) {
    set(this, 'status.state', state);
  }

  get state() {
    return this.status?.state;
  }

  get name() {
    return this.spec?.name;
  }

  get region() {
    return this.spec?.region;
  }

  get unsecureHttp() {
    return this.spec?.unsecureHttp;
  }

  get replicas() {
    return this.spec?.scalingStrategy?.fixed?.replicas;
  }

  get duration() {
    return this.status?.duration;
  }

  get accessUrl() {
    return this.status?.url;
  }

  get stateInfo() {
    const state = this.status.state.toUpperCase();
    return {
      state,
      stateGroup: {
        error: APP_STATES.ERROR.includes(state),
        warning: APP_STATES.WARNING.includes(state),
        success: APP_STATES.SUCCESS.includes(state),
      },
    };
  }

  get labels() {
    return this.spec.labels;
  }

  set labels(labels) {
    this.spec.labels = labels;
  }

  get cpu() {
    return this.spec?.resources?.cpu;
  }

  get gpu() {
    return this.spec?.resources?.gpu || 'none';
  }

  get memory() {
    return this.spec.resources.memory;
  }

  get gpuMemory() {
    return this.spec.resources.gpuMemory;
  }

  get ephemeralStorage() {
    return this.spec.resources.ephemeralStorage;
  }

  get formattedCreationDate() {
    return moment(this.createdAt).format('LLL');
  }

  get attachDataInfoLink() {
    return APP_STORAGE_INFO[this.ovhSubsidiary] || APP_STORAGE_INFO.DEFAULT;
  }

  get extraRegionInfo() {
    return `${this.regionInfo.country} - ${this.regionInfo.macroRegion.text} (${this.region})`;
  }

  get volumes() {
    return this.spec.volumes;
  }

  get flavor() {
    return this.spec.resources.flavor;
  }

  geNbContainerByType(type) {
    return this.volumes.filter((volume) => volume.volumeType === type).length;
  }

  getSelectedFlavor(flavors) {
    return flavors.find((flavor) => flavor.id === this.spec.resources.flavor);
  }

  tagsLimitIsReached() {
    return this.labels.length >= APP_TAGS.LIMIT;
  }

  updateData(data) {
    merge(this, data);
  }
}
