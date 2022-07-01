import { find } from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import { API_GUIDES } from '../../project.constants';
import {
  SUBMIT_JOB_API_GUIDES,
  GIB_IN_MIB,
} from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    dataProcessingService,
    ovhManagerRegionService,
    atInternet,
  ) {
    this.$state = $state;
    this.$scope = $scope;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.atInternet = atInternet;
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
    this.badRequestErrorMessage = '';
    this.isConfigureStepValid = false;
    this.currentIndex = 0;
  }

  $onInit() {
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;
    this.submitJobGuideUrl =
      SUBMIT_JOB_API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;

    this.scrollToOptions = {
      element: document.getElementsByClassName('pci-project-content')[0],
      offset: 0,
      horizontal: false,
    };

    this.$scope.$watch(
      '$ctrl.state',
      () => {
        this.prepareJobPayload();
      },
      true,
    );
  }

  scrollTo(id) {
    animateScrollTo(document.getElementById(id), this.scrollToOptions);
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
    this.onChangeRegionHandler(this.regions[0]);
  }

  /**
   * Fetch available job parameters from capabilities and update binding
   */
  updateAvailableJobParameters() {
    const engine = find(
      this.capabilities,
      (e) => e.name === this.state.jobEngine.engine,
    );
    this.jobParameters = {};
    engine.parameters.forEach((jobParameter) => {
      this.jobParameters[jobParameter.name] = jobParameter;
    });
  }

  /**
   * Handler for region selector change
   * @param name Name of the selected region
   */
  onChangeRegionHandler(region) {
    this.state.region = region;
    this.updateAvailableJobParameters();
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
    this.updateAvailableRegions();
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

  /**
   * Parse API error responses to extract the message and make it compatible with translations
   */
  parseSubmitErrorMessage(errorMessage) {
    this.badRequestErrorMessage = errorMessage
      .replace(
        /Client::BadRequest::|Client::UnprocessableEntity::/gi,
        'data_processing_submit_job_error_message_',
      )
      .replace(/\./g, '_');
  }

  prepareJobPayload() {
    let args = '';
    if (this.state.jobConfig.currentArgument.length > 0) {
      this.state.jobConfig.arguments.push({
        title: this.state.jobConfig.currentArgument,
      });
      this.state.jobConfig.currentArgument = '';
    }
    if (this.state.jobConfig.arguments.length > 0) {
      args = this.state.jobConfig.arguments.map((o) => o.title).join(',');
    }
    const payload = {
      containerName: this.state.jobConfig.swiftContainer,
      engine: this.state.jobEngine.engine,
      engineVersion: this.state.jobEngine.version,
      name: this.state.jobConfig.jobName,
      region: this.state.region.name,
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
          value: (this.state.jobSizing.driverMemoryGb * 1024).toString(),
        },
        {
          name: 'executor_memory',
          value: (this.state.jobSizing.workerMemoryGb * 1024).toString(),
        },
        {
          name: 'driver_memory_overhead',
          value: this.state.jobSizing.driverMemoryOverheadMb.toString(),
        },
        {
          name: 'executor_memory_overhead',
          value: this.state.jobSizing.workerMemoryOverheadMb.toString(),
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

    this.orderData = payload;
    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/dataProcessing/jobs`;
  }

  onSubmitJobHandler() {
    this.prepareJobPayload();
    const lastIndex = this.currentIndex;
    this.isSubmitting = true;

    this.dataProcessingService
      .submitJob(this.projectId, this.orderData)
      .then(({ data }) => {
        this.atInternet.trackClick({
          name:
            'public-cloud::pci::projects::project::data-processing::submit-job::submit',
          type: 'action',
        });
        this.goToDashboard(data.id);
      })
      .catch((error) => {
        if (
          error.status !== 400 &&
          error.status !== 422 &&
          this.submitRetries < 2
        ) {
          this.onSubmitJobHandler();
        } else {
          if (error.status === 400 || error.status === 422) {
            this.parseSubmitErrorMessage(error.data.data.class);
          }
          this.isSubmitting = false;
          this.currentIndex = lastIndex - 1;
          // this is a trick to circumvent limitations of the stepper component.
          // in case of error, it allows user to submit again through the stepper.
          setTimeout(() => {
            this.currentIndex = lastIndex;
            this.$scope.$apply();
          }, 0);
        }
        this.submitRetries += 1;
      });
  }

  computePrice() {
    const {
      workerMemoryGb,
      driverMemoryGb,
      workerCount,
      workerMemoryOverheadMb,
      driverMemoryOverheadMb,
      driverCores,
      workerCores,
    } = this.state.jobSizing;
    const pricePerGiB = this.prices.memory.priceInUcents;
    const pricePerCore = this.prices.core.priceInUcents;
    return (
      (workerMemoryGb + workerMemoryOverheadMb / GIB_IN_MIB) *
        pricePerGiB *
        workerCount +
      (driverMemoryGb + driverMemoryOverheadMb / GIB_IN_MIB) * pricePerGiB +
      (driverCores + workerCores * workerCount) * pricePerCore
    );
  }

  /**
   * Compute the estimated tax on the estimated price /min depending on job sizing.
   * @return {number}
   */
  computeTax() {
    const {
      workerMemoryGb,
      driverMemoryGb,
      workerCount,
      workerMemoryOverheadMb,
      driverMemoryOverheadMb,
      driverCores,
      workerCores,
    } = this.state.jobSizing;
    const taxMemory = this.prices.memory.tax;
    const taxCores = this.prices.core.tax;
    return (
      (workerMemoryGb + workerMemoryOverheadMb / GIB_IN_MIB) *
        taxMemory *
        workerCount +
      (driverMemoryGb + driverMemoryOverheadMb / GIB_IN_MIB) * taxMemory +
      (driverCores + workerCores * workerCount) * taxCores
    );
  }

  getArgumentsList() {
    return this.state.jobConfig.arguments.map((a) => a.title).join(' ');
  }
}
