import { find } from 'lodash';
import { convertMemory } from '../data-processing.utils';

export default class {
  /* @ngInject */
  constructor($scope, $state, dataProcessingService, CucRegionService) {
    this.$state = $state;
    this.$scope = $scope;
    this.dataProcessingService = dataProcessingService;
    this.cucRegionService = CucRegionService;
    // let's do some function binding
    this.onChangeRegionHandler = this.onChangeRegionHandler.bind(this);
    this.onChangeJobTypeHandler = this.onChangeJobTypeHandler.bind(this);
    this.onChangeJobConfigHandler = this.onChangeJobConfigHandler.bind(this);
    // initialize component state
    this.state = {
      region: null,
      jobEngine: {},
      jobSizing: {},
      jobConfig: {},
    };
    // we use this trick to trigger a state update of child component. This circumvent the missing
    // onChange event on oui-field components.
    this.jobSizingValidate = false;
    this.submitRetries = 0;
    this.isSubmitting = false;
    this.isConfigureStepValid = false;
    this.currentIndex = 0;
  }

  /**
   * Fetch available regions from capabilities and update binding
   */
  updateAvailableRegions() {
    const engine = find(
      this.capabilities,
      (e) => e.name === this.state.jobEngine.engine,
    );
    const version = find(
      engine.availableVersions,
      (v) => v.name === this.state.jobEngine.version,
    );
    this.regions = version.availableRegions.map((region) => ({
      name: region,
      hasEnoughQuota: () => true,
    }));
  }

  /**
   * Handler for region selector change
   * @param name Name of the selected region
   */
  onChangeRegionHandler({ name }) {
    this.state.region = name;
  }

  /**
   * Handler for job type selector job
   * @param jobType Selected job type
   */
  onChangeJobTypeHandler(jobType) {
    const e = find(this.capabilities, (o) => o.name === jobType.engine);
    this.state.jobEngine = {
      ...jobType,
      templates: e.templates,
    };
  }

  onSubmitJobSizingHandler() {
    // trigger job sizing component values update
    this.jobSizingValidate = !this.jobSizingValidate;
  }

  /**
   * Handler for job config change
   * @param jobConfig Job configuration
   */
  onChangeJobConfigHandler(jobConfig) {
    this.state.jobConfig = jobConfig;
  }

  onSubmitJobHandler() {
    const lastIndex = this.currentIndex;
    this.isSubmitting = true;
    let args = '';
    if (this.state.jobConfig.arguments.length > 0) {
      args = this.state.jobConfig.arguments.map((o) => o.title).join(',');
    }
    const payload = {
      containerName: this.state.jobConfig.swiftContainer,
      engine: this.state.jobEngine.engine,
      engineVersion: this.state.jobEngine.version,
      name: this.state.jobConfig.jobName,
      region: this.state.region,
      engineParameters: [
        {
          name: 'main_application_code',
          value: this.state.jobConfig.mainApplicationCode,
        },
        {
          name: 'arguments',
          // handle iceberg limitation concerning arrays. We use comma-delimited string
          value: args,
        },
        {
          name: 'driver_memory',
          value: convertMemory(`${this.state.jobSizing.driverMemoryGb}G`, 'Gi'),
        },
        {
          name: 'executor_memory',
          value: convertMemory(`${this.state.jobSizing.workerMemoryGb}G`, 'Gi'),
        },
        {
          name: 'driver_cores',
          value: this.state.jobSizing.driverCores.toString(),
        },
        {
          name: 'executor_num',
          value: this.state.jobSizing.workerCount.toString(),
        },
        {
          name: 'executor_cores',
          value: this.state.jobSizing.workerCores.toString(),
        },
        {
          name: 'job_type',
          value: this.state.jobConfig.jobType,
        },
      ],
    };
    if (this.state.jobConfig.jobType === 'java') {
      payload.engineParameters.push({
        name: 'main_class_name',
        value: this.state.jobConfig.mainClass,
      });
    }
    this.dataProcessingService.submitJob(this.projectId, payload).then(
      () => {
        this.goBack();
      },
      () => {
        if (this.submitRetries < 2) {
          this.submitRetries += 1;
          this.onSubmitJobHandler();
        } else {
          this.isSubmitting = false;
          this.currentIndex = lastIndex - 1;
          // this is a trick to circumvent limitations of the stepper component.
          // in case of error, it allows user to submit again through the stepper.
          // fixes https://projects.dsi.ovh/browse/MANAGER-4599
          setTimeout(() => {
            this.currentIndex = lastIndex;
            this.$scope.$apply();
          }, 0);
        }
      },
    );
  }
}
