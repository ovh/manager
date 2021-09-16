import has from 'lodash/has';
import merge from 'lodash/merge';
import set from 'lodash/set';
import 'moment';

import {
  NOTEBOOK_AUTOMATION_INFO,
  NOTEBOOK_STATES,
  NOTEBOOK_STATUS,
  NOTEBOOK_STORAGE_INFO,
  NOTEBOOK_TAGS,
  NOTEBOOK_VOLUME_TYPE,
} from './quantum-computing.constants';

export default class Notebook {
  /**
   * Create a Notebook instance
   * @param notebook {Object}: native JS object
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

    /* TODO:: currently the api return the labels as an object ({lab: "val1", lab1: "val2", txt: "test" ...})
     * TODO:: instead of return a list of object ([{id: "lab", title: "val1"}, ...])
     * TODO:: to be able to use the chips component i made a copy of labels into tags and convert labels to array of object
     * TODO:: if API provide labels as a list of object remove the two next assignation lines
     */
    this.spec.labels = Object.keys(this.labels).map((labelKey) =>
      Notebook.generateLabel(labelKey, this.labels[labelKey]),
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
    const volumeTypeKey = Object.keys(NOTEBOOK_VOLUME_TYPE).find((type) =>
      has(volume, type.toLowerCase()),
    );
    return NOTEBOOK_VOLUME_TYPE[volumeTypeKey];
  }

  static notebookCommandModel(notebook) {
    const { spec, volumes } = notebook;
    const { editor, framework, ...env } = spec.env;
    const specCopy = { ...spec };
    specCopy.env = env;

    return {
      ...specCopy,
      labels: notebook.convertLabels(),
      volumes,
    };
  }

  isStarting() {
    return this.status?.state === NOTEBOOK_STATUS.STARTING;
  }

  isRunning() {
    return this.status?.state === NOTEBOOK_STATUS.RUNNING;
  }

  isStopped() {
    return this.status?.state === NOTEBOOK_STATUS.STOPPED;
  }

  isStopping() {
    return this.status?.state === NOTEBOOK_STATUS.STOPPING;
  }

  isPending() {
    return this.isStarting() || this.isStopping();
  }

  isFailed() {
    return this.status?.state === NOTEBOOK_STATUS.FAILED;
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
        error: NOTEBOOK_STATES.ERROR.includes(state),
        warning: NOTEBOOK_STATES.WARNING.includes(state),
        success: NOTEBOOK_STATES.SUCCESS.includes(state),
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
      NOTEBOOK_AUTOMATION_INFO[this.ovhSubsidiary] ||
      NOTEBOOK_AUTOMATION_INFO.DEFAULT
    );
  }

  get attachDataInfoLink() {
    return (
      NOTEBOOK_STORAGE_INFO[this.ovhSubsidiary] || NOTEBOOK_STORAGE_INFO.DEFAULT
    );
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
    return this.labels.length >= NOTEBOOK_TAGS.LIMIT;
  }

  updateData(data) {
    merge(this, data);
  }
}
