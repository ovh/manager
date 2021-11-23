import has from 'lodash/has';
import merge from 'lodash/merge';
import set from 'lodash/set';
import 'moment';

import {
  APP_AUTOMATION_INFO,
  APP_STATES,
  APP_STATUS,
  APP_STORAGE_INFO,
  APP_TAGS,
  APP_VOLUME_TYPE,
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

    // Build a history actions
    this.historyActions = [
      { index: 1, action: 'create', date: this.createdAt },
      { index: 2, action: 'restart', date: this.status.lastStartedAt },
      { index: 3, action: 'stopped', date: this.status.lastStoppedAt },
    ];
  }

  /**
   * Generate a label
   * @param id {String|Number|null}: label id
   * @param title {String|Number|null}: label value
   * @returns {{id: null, title: null}}
   */
  static generateLabel(id = null, title = null) {
    return { id, title };
  }

  /**
   * Return volume type
   * @param volume {Object}: volume object
   * @returns {String}: can be SWIFT|GIT
   */
  static getVolumeType(volume) {
    const volumeTypeKey = Object.keys(APP_VOLUME_TYPE).find((type) =>
      has(volume, type.toLowerCase()),
    );
    return APP_VOLUME_TYPE[volumeTypeKey];
  }

  static appCommandModel(app) {
    const { spec, volumes } = app;
    const { editor, framework, ...env } = spec.env;
    const specCopy = { ...spec };
    specCopy.env = env;

    return {
      ...specCopy,
      labels: app.convertLabels(),
      volumes,
    };
  }

  isStarting() {
    return this.status?.state === APP_STATUS.STARTING;
  }

  isRunning() {
    return this.status?.state === APP_STATUS.RUNNING;
  }

  isStopped() {
    return this.status?.state === APP_STATUS.STOPPED;
  }

  isStopping() {
    return this.status?.state === APP_STATUS.STOPPING;
  }

  isPending() {
    return this.isStarting() || this.isStopping();
  }

  isFailed() {
    return this.status?.state === APP_STATUS.FAILED;
  }

  isInError() {
    return this.status?.state === APP_STATUS.ERROR;
  }

  isTerminal() {
    return this.isStopped() || this.isFailed() || this.isInError();
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

  simulateAddLabel(label) {
    const labels = [...this.labels];
    const labelIndex = this.getLabelIndex(label);
    if (labelIndex >= 0) {
      labels[labelIndex].title = label.title;
    } else {
      labels.push(label);
    }

    return labels;
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

  get duration() {
    return this.status?.duration;
  }

  get durationString() {
    const duration = moment.duration(this.duration, 'seconds');
    let durationString = duration.years() ? `${duration.years()}y` : '';
    durationString =
      duration.months() || durationString
        ? `${durationString} ${duration.months()}m`
        : durationString;
    durationString =
      duration.days() || durationString
        ? `${durationString} ${duration.days()}d`
        : durationString;
    durationString =
      duration.hours() || durationString
        ? `${durationString} ${duration.hours()}h`
        : durationString;
    durationString = `${durationString} ${duration.minutes()}mn`;
    return durationString;
  }

  get accessUrl() {
    return this.status?.url;
  }

  get editor() {
    return this.spec?.env?.editor;
  }

  get framework() {
    return this.spec?.env?.framework;
  }

  get frameworkVersion() {
    return this.spec?.env?.frameworkVersion;
  }

  get environment() {
    return `${this.spec.env.frameworkId} - ${this.spec.env.frameworkVersion}`;
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

  get formattedRunningDuration() {
    return moment.duration(this.status.duration, 'seconds').humanize();
  }

  get formattedCreationDate() {
    return moment(this.createdAt).format('LLL');
  }

  get automationInfoLink() {
    return (
      APP_AUTOMATION_INFO[this.ovhSubsidiary] || APP_AUTOMATION_INFO.DEFAULT
    );
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
