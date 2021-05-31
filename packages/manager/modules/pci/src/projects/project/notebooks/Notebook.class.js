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
} from './Notebook.constants';

const VOLUME_TYPE = 'volumeType';

export default class Notebook {
  /**
   * Create a Notebook instance
   * @param notebook {Object}: native JS object
   * @param coreConfig {Object|undefined}: (optional) used to get link info
   * @param CucRegionService {CucRegionService|undefined}: (optional) used to get more info about a region
   * */
  constructor(
    { createdAt, id, spec, status, updatedAt, user },
    coreConfig,
    CucRegionService,
  ) {
    this.updateData({
      createdAt,
      id,
      spec,
      status,
      updatedAt,
      user,
    });
    this.coreConfig = coreConfig;
    this.CucRegionService = CucRegionService;

    this.volumes = this.volumes || [];
    this.volumesBackup = Object.freeze([...this.volumes]);
    this.volumes = this.volumes.map((volume) => ({
      ...volume,
      [VOLUME_TYPE]: Notebook.getVolumeType(volume),
    }));

    /* TODO:: currently the api return the labels as an object ({lab: "val1", lab1: "val2", txt: "test" ...})
     * TODO:: instead of return a list of object ([{id: "lab", title: "val1"}, ...])
     * TODO:: to be able to use the chips component i made a copy of labels into tags and convert labels to array of object
     * TODO:: if API provide labels as a list of object remove the two next assignation lines
     */
    this.spec.labelsBackup = Object.freeze({ ...this.labels });
    this.spec.labels = Object.keys(this.labels).map((labelKey) =>
      Notebook.generateLabel(labelKey, this.labels[labelKey]),
    );
  }

  /**
   * Create Notebook instance copy
   * @param notebook {Notebook}: Notebook instance or notebook JS object
   * @returns {Notebook}: notebook instance copy
   */
  static copy(notebook) {
    const notebookCopy = JSON.parse(JSON.stringify(notebook));
    notebookCopy.volumes = { ...notebookCopy.volumesBackup };

    // TODO: can be removed if API return labels as list of object
    notebookCopy.spec.labels = { ...notebookCopy.spec.labelsBackup };

    return new Notebook(
      notebookCopy,
      notebook?.coreConfig,
      notebook?.CucRegionService,
    );
  }

  /**
   * Must be used to generate a label
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

  /**
   * Call this have a ready notebook object to send
   * @returns {Notebook}: notebook instance copy
   */
  copyToSend() {
    const nCopy = JSON.parse(JSON.stringify(this));
    nCopy.spec.labels = this.restoreLabels();
    nCopy.volumes = this.restoreVolumes();
  }

  /**
   * Used to convert array of labels object to an object
   * TODO:: can be removed once API return labels as list of object
   * @returns {Object}: labels object
   */
  restoreLabels() {
    return this.labels.reduce((acc, label) => {
      acc[label.id] = label.title;
      return acc;
    }, {});
  }

  /**
   * Used to convert array of labels object to an object
   * TODO:: can be removed once the API provide volume type property
   * @returns {Array}: labels object
   */
  restoreVolumes() {
    return this.volumes.map((volume) => {
      const { [VOLUME_TYPE]: remove, ...rest } = volume;
      return rest;
    });
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

  get state() {
    return this.status?.state;
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

  addLabel(label) {
    const labelIndex = this.getLabelIndex(label);
    if (labelIndex >= 0) {
      this.labels[labelIndex].title = label.title;
    } else {
      this.labels.push(label);
    }
  }

  get name() {
    return this.spec?.name;
  }

  get region() {
    return this.spec?.region;
  }

  get cpu() {
    return this.spec?.resources?.cpu;
  }

  get gpu() {
    return this.spec?.resources?.gpu;
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

  setState(state) {
    set(this, 'status.state', state);
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

  get formattedRunningDuration() {
    return moment.duration(this.status.duration, 'seconds').humanize();
  }

  get formattedCreationDate() {
    return moment(this.createdAt).format('LLL');
  }

  get automationInfoLink() {
    return (
      NOTEBOOK_AUTOMATION_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_AUTOMATION_INFO.DEFAULT
    );
  }

  get attachDataInfoLink() {
    return (
      NOTEBOOK_STORAGE_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_STORAGE_INFO.DEFAULT
    );
  }

  get regionInfo() {
    return this.CucRegionService.getRegion(this.region);
  }

  get extraRegionInfo() {
    return `${this.regionInfo.country} - ${this.regionInfo.macroRegion.text} (${this.region})`;
  }

  geNbContainerByType(type) {
    return this.volumes.filter((volume) => volume.volumeType === type).length;
  }

  getSelectedFlavor(flavors) {
    return (
      flavors.find((flavor) => flavor.id === this.spec.resources.gpuModel) ||
      flavors[0]
    );
  }

  tagsLimitIsReached() {
    return this.labels.length >= NOTEBOOK_TAGS.LIMIT;
  }

  updateData(data) {
    merge(this, data);
  }
}
