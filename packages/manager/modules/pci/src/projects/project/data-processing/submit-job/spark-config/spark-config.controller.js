import { filter, find } from 'lodash';
import {
  PYTHON_ENV_FILENAME,
  PYTHON_FILES_CONTENT_TYPES,
  JAVA_FILES_CONTENT_TYPES,
} from './spark-config.constants';
import {
  JOB_TYPE_JAVA,
  JOB_TYPE_PYTHON,
} from '../../data-processing.constants';
import { nameGenerator } from '../../data-processing.utils';

export default class {
  /* @ngInject */
  constructor($scope, SparkConfigService, $translate) {
    this.$scope = $scope;
    // create state
    this.state = {};
    this.swiftContainers = {};
    this.swiftContainersInRegion = {};
    this.sparkConfigService = SparkConfigService;
    this.containerObjects = [];
    this.$translate = $translate;
  }

  $onInit() {
    this.JOB_TYPE_PYTHON = JOB_TYPE_PYTHON;
    this.JOB_TYPE_JAVA = JOB_TYPE_JAVA;
    this.swiftContainers = [];
    // initialize component state
    this.state = {
      arguments: '',
      jobName: nameGenerator(),
      mainApplicationCodeFileNotFound: false, // used by UI to show a warning when file is not found
      mainApplicationCodeFileInvalid: false, // used by UI to show a warning when main application file is invalid
      pythonEnvironmentMissing: false, // used by UI to show a warning when environment.yml file is missing
      ttl: {
        enabled: false,
        unit: null,
        time: 10,
      },
    };
    this.sparkConfigService
      .listContainers(this.projectId)
      .then((containers) => {
        this.swiftContainers = containers;
        this.$onChanges();
      });

    this.$scope.$watch(
      '$ctrl.region',
      () => {
        this.$onChanges();
      },
      true,
    );

    this.units = [
      {
        name: 'minutes',
        description: this.$translate.instant(
          'data_processing_submit_job_stepper_spark_select_unit_minutes',
        ),
      },
      {
        name: 'hours',
        multiplier: 60,
        description: this.$translate.instant(
          'data_processing_submit_job_stepper_spark_select_unit_hours',
        ),
      },
      {
        name: 'days',
        multiplier: 1440,
        description: this.$translate.instant(
          'data_processing_submit_job_stepper_spark_select_unit_days',
        ),
      },
    ];

    [this.state.ttl.unit] = this.units;

    this.onChangeHandler(this.state);
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
        // try to detect correct job type and file
        const pythonFiles = container.objects.filter((object) =>
          PYTHON_FILES_CONTENT_TYPES.includes(object.contentType),
        );
        const javaFiles = container.objects.filter((object) =>
          JAVA_FILES_CONTENT_TYPES.includes(object.contentType),
        );
        if (pythonFiles.length > 0) {
          this.state.jobType = JOB_TYPE_PYTHON;
          this.state.mainApplicationCode = pythonFiles[0].name;
        } else if (javaFiles.length > 0) {
          this.state.jobType = JOB_TYPE_JAVA;
          this.state.mainApplicationCode = javaFiles[0].name;
        } else if (this.state.mainApplicationCode) {
          this.state.mainApplicationCode = '';
        }
        // handle case where customer started by code filename before selecting container
        this.onMainApplicationCodeChangeHandler();
      });
    this.onChangeHandler(this.state);
  }

  onMainApplicationCodeChangeHandler() {
    const fileObject = find(
      this.containerObjects,
      (o) => o.name === this.state.mainApplicationCode,
    );
    // check for proper JAR (just a warning, no blocking error in case MIME type is wrong in Object Storage)
    this.state.mainApplicationCodeFileInvalid =
      fileObject &&
      this.state.jobType === JOB_TYPE_JAVA &&
      !JAVA_FILES_CONTENT_TYPES.includes(fileObject.contentType);
    // check if file exists
    this.state.mainApplicationCodeFileNotFound = fileObject === undefined;
    // check if environment file exists
    const environmentFileObject = find(
      this.containerObjects,
      (o) => o.name === PYTHON_ENV_FILENAME,
    );
    this.state.pythonEnvironmentMissing =
      !environmentFileObject && this.state.jobType === JOB_TYPE_PYTHON;
    this.checkValidity();
    this.onChangeHandler(this.state);
  }

  onJobTypeChangeHandler() {
    // handle case where customer changes job type after typing filename
    this.onMainApplicationCodeChangeHandler();
    this.onChangeHandler(this.state);
  }

  checkValidity() {
    // check for field global validity (files exist)
    this.valid =
      !this.state.pythonEnvironmentMissing &&
      !this.state.mainApplicationCodeFileNotFound &&
      !(this.state.jobType === JOB_TYPE_JAVA && !this.state.mainClass);
  }

  /**
   * Handler to manage Main Class field changes
   */
  onMainClassChangeHandler() {
    this.checkValidity();
    this.onChangeHandler(this.state);
  }
}
