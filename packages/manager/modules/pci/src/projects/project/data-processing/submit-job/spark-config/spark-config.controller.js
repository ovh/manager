import { filter, find } from 'lodash';
import { ARGUMENTS_VALIDATION_PATTERN } from './spark-config.constants';
import { nameGenerator } from '../../data-processing.utils';

export default class {
  /* @ngInject */
  constructor($scope, SparkConfigService) {
    this.$scope = $scope;
    // create state
    this.state = {};
    this.swiftContainers = {};
    this.swiftContainersInRegion = {};
    this.currentArgument = '';
    this.sparkConfigService = SparkConfigService;
    this.containerObjects = [];
  }

  $onInit() {
    this.swiftContainers = [];
    // initialize component state
    this.state = {
      arguments: [],
      jobName: nameGenerator(),
      mainApplicationCodeFileNotFound: false, // used by UI to show a warning when file is not found
      mainApplicationCodeFileInvalid: false, // used by UI to show a warning when file is not found
    };
    this.sparkConfigService
      .listContainers(this.projectId)
      .then((containers) => {
        this.swiftContainers = containers;
      });
  }

  $onChanges() {
    if (this.region !== null) {
      this.swiftContainersInRegion = filter(
        this.swiftContainers,
        (c) => c.region === this.region.substr(0, 3),
      ).map((container) => container.name);
    }
  }

  /**
   * Handler to manage user container selection.
   * Object list is retrieved from API for selected container.
   */
  onContainerChangeHandler() {
    const containerId = find(
      this.swiftContainers,
      (c) =>
        c.name === this.state.swiftContainer &&
        c.region === this.region.substr(0, 3),
    ).id;
    this.sparkConfigService
      .listObjects(this.projectId, containerId)
      .then((container) => {
        this.containerObjects = container.objects;
        // handle case where customer started by code filename before selecting container
        this.onMainApplicationCodeChangeHandler();
      });
    this.onChangeHandler(this.state);
  }

  onMainApplicationCodeChangeHandler() {
    const obj = find(
      this.containerObjects,
      (o) => o.name === this.state.mainApplicationCode,
    );
    this.state.mainApplicationCodeFileInvalid =
      obj !== undefined &&
      obj.contentType !== 'application/java-archive' &&
      this.state.jobType === 'java';
    this.state.mainApplicationCodeFileNotFound = obj === undefined;
    this.onChangeHandler(this.state);
  }

  onJobTypeChangeHandler() {
    // handle case where customer changes job type after typing filename
    this.onMainApplicationCodeChangeHandler();
    this.onChangeHandler(this.state);
  }

  /**
   * Handler to add current arguments to the chips argument list
   * @param evt <enter> key event
   */
  onSubmitArgumentHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const arg = evt.target.value;
    // validate argument against authorized pattern
    if (arg.match(ARGUMENTS_VALIDATION_PATTERN)) {
      this.state.arguments.push({
        title: arg,
      });
      this.currentArgument = '';
    }
    this.onChangeHandler(this.state);
  }

  /**
   * Handler to manage Main Class field changes
   */
  onMainClassChangeHandler() {
    this.onChangeHandler(this.state);
  }
}
