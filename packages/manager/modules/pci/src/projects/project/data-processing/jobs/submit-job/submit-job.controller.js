import { find } from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import { API_GUIDES } from '../../../project.constants';
import {
  SUBMIT_JOB_API_GUIDES,
  GIB_IN_MIB,
  DATA_PROCESSING_TRACKING_PREFIX_FULL,
} from '../../data-processing.constants';

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
    if (this.state.jobSizing?.driverMemoryGb) {
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
            value: this.state.jobConfig.arguments.replaceAll(' ', ','),
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
      if (this.state.jobConfig.ttl.enabled) {
        payload.ttl = moment.duration(
          this.state.jobConfig.ttl.time,
          this.state.jobConfig.ttl.unit.name,
        );
      }
      this.orderData = payload;
    }

    this.orderAPIUrl = `POST /cloud/project/${this.projectId}/dataProcessing/jobs`;

    // Compute prices and taxes
    const {
      workerMemoryGb,
      driverMemoryGb,
      workerCount,
      workerMemoryOverheadMb,
      driverMemoryOverheadMb,
      driverCores,
      workerCores,
    } = this.state.jobSizing;
    const driverMemoryOverheadGb = driverMemoryOverheadMb / GIB_IN_MIB;
    const workerMemoryOverheadGb = workerMemoryOverheadMb / GIB_IN_MIB;
    const totalMemory =
      (workerMemoryGb + workerMemoryOverheadGb) * workerCount +
      (driverMemoryGb + driverMemoryOverheadGb);

    this.jobPrices = {
      workerCount,
      cores: {
        worker: workerCores,
        driver: driverCores,
        price: this.prices.core.priceInUcents,
        tax: this.prices.core.tax,
        totalPrice:
          (driverCores + workerCores * workerCount) *
          this.prices.core.priceInUcents,
        totalTax:
          (driverCores + workerCores * workerCount) * this.prices.core.tax,
      },
      memory: {
        driver: {
          base: driverMemoryGb,
          overhead: driverMemoryOverheadGb,
        },
        worker: {
          base: workerMemoryGb,
          overhead: workerMemoryOverheadMb / GIB_IN_MIB,
        },
        total: totalMemory,
        price: this.prices.memory.priceInUcents,
        tax: this.prices.memory.tax,
        totalPrice: totalMemory * this.prices.memory.priceInUcents,
        totalTax: totalMemory * this.prices.memory.tax,
      },
    };
  }

  onSubmitJobHandler() {
    this.prepareJobPayload();
    const lastIndex = this.currentIndex;
    this.isSubmitting = true;

    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::submit-job::confirm`,
      type: 'action',
    });

    this.dataProcessingService
      .submitJob(this.projectId, this.orderData)
      .then(({ data }) => {
        this.atInternet.trackPage({
          name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::submit-job-success`,
          type: 'page',
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
          this.atInternet.trackPage({
            name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::submit-job-error`,
            type: 'page',
          });
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

  getArgumentsList() {
    return this.state.jobConfig.arguments.map((a) => a.title).join(' ');
  }
}
