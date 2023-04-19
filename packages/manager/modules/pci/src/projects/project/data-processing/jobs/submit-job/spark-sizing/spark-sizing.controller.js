import { GIB_IN_MIB } from '../../../data-processing.constants';
import { MEMORY_OVERHEAD_RATIO } from './spark-sizing.constants';

export default class {
  /* @ngInject */
  constructor(dataProcessingService, $scope) {
    // let's do some bindings
    this.onClickAdvancedConfigurationHandler = this.onClickAdvancedConfigurationHandler.bind(
      this,
    );
    // create state
    this.state = {};
    this.driverTemplates = null;
    this.workerTemplates = null;
    this.dataProcessingService = dataProcessingService;
    this.$scope = $scope;
  }

  $onInit() {
    this.minMemoryOverheadMb = this.jobParameters.executor_memory_overhead.validator.min;
    this.maxMemoryDriverGb = Math.floor(
      this.jobParameters.driver_memory.validator.max / 1024,
    );
    this.maxMemoryWorkerGb = Math.floor(
      this.jobParameters.executor_memory.validator.max / 1024,
    );
    // initialize component state
    this.state = {
      driverTemplate: '1',
      workerTemplate: '1',
      workerCount: 1,
      workerCores: 1,
      workerMemoryGb: 1,
      workerMemoryOverheadMb: this.jobParameters.executor_memory_overhead
        .validator.min,
      driverCores: 1,
      driverMemoryGb: 1,
      driverMemoryOverheadMb: this.jobParameters.driver_memory_overhead
        .validator.min,
      advancedSizing: false,
      advancedSizingDriverMemOverheadAuto: true,
      advancedSizingWorkerMemOverheadAuto: true,
    };
    // update overhead memory from template
    this.updateStateFromTemplate();

    this.$scope.$watch(
      '$ctrl.state',
      () => {
        this.$onChanges();
      },
      true,
    );
  }

  /**
   * Event handler that is called each time component is updated
   * Update component `values` binding to let know our parent component about state update
   * Parent must use `validate` binding to trigger changes.
   */
  $onChanges() {
    if (this.state.driverTemplate) {
      Object.assign(this.values, this.state);
      if (this.templates) {
        this.driverTemplates = this.templates;
        this.workerTemplates = this.templates;
        if (!this.state.advancedSizing) {
          this.updateStateFromTemplate();
        }
      }
    }
  }

  /**
   * Handler for sizing advanced configuration link
   */
  onClickAdvancedConfigurationHandler() {
    if (!this.state.advancedSizing) {
      this.updateStateFromTemplate();
    }
    this.state.advancedSizing = !this.state.advancedSizing;
  }

  /**
   * Handler for the checkbox allowing the editing of the driver memory overhead
   */
  onChangeAdvancedSizingDriverMemOverheadHandler(newValue) {
    if (this.state.advancedSizing && newValue) {
      this.updateMemoryOverHead(this.state.driverMemoryGb, newValue, 'driver');
    }
  }

  /**
   * Handler for the checkbox allowing the editing of the worker memory overhead
   */
  onChangeAdvancedSizingWorkerMemOverheadHandler(newValue) {
    if (this.state.advancedSizing && newValue) {
      this.updateMemoryOverHead(this.state.workerMemoryGb, newValue, 'worker');
    }
  }

  /**
   * Handler for the driver memory field, updating the driver memory overhead field as well if it's automatically computed
   */
  onChangeDriverMemoryHandler(newValue) {
    this.updateMemoryOverHead(
      newValue,
      this.state.advancedSizingDriverMemOverheadAuto,
      'driver',
    );
  }

  /**
   * Handler for the driver memory field, updating the driver memory overhead field as well if it's automatically computed
   */
  onChangeWorkerMemoryHandler(newValue) {
    this.updateMemoryOverHead(
      newValue,
      this.state.advancedSizingDriverMemOverheadAuto,
      'worker',
    );
  }

  /**
   * Compute, if auto computation is enabled, the memory overhead for a node
   * @param memory memory to use as base for the computation of the overhead value
   * @param autoComputation flag to check if auto computation is enabled
   * @param nodeType the type of node (worker or driver) for which the computation is done
   */
  updateMemoryOverHead(memoryGb, autoComputation, nodeType) {
    if (this.state.advancedSizing && autoComputation) {
      let memOverhead = memoryGb * GIB_IN_MIB * MEMORY_OVERHEAD_RATIO; // overhead = 10% of memory in MiB
      if (
        memOverhead + memoryGb * GIB_IN_MIB >
        this.jobParameters.executor_memory.validator.max
      ) {
        memOverhead = parseInt(
          this.jobParameters.executor_memory.validator.max -
            memoryGb * GIB_IN_MIB,
          10,
        );
      } else {
        memOverhead = parseInt(memOverhead, 10);
      }

      if (memOverhead < this.minMemoryOverheadMb) {
        memOverhead = this.minMemoryOverheadMb;
      }
      if (nodeType === 'driver') {
        this.state.driverMemoryOverheadMb = memOverhead;
      } else if (nodeType === 'worker') {
        this.state.workerMemoryOverheadMb = memOverhead;
      }
    }

    if (nodeType === 'driver') {
      this.maxOverheadMemoryDriverGb = parseInt(
        this.jobParameters.driver_memory.validator.max - memoryGb * GIB_IN_MIB,
        10,
      );
    } else if (nodeType === 'worker') {
      this.maxOverheadMemoryWorkerGb = parseInt(
        this.jobParameters.executor_memory.validator.max -
          memoryGb * GIB_IN_MIB,
        10,
      );
    }
  }

  /**
   * Use sizing template to update all the individual cores/memory fields of current state
   */
  updateStateFromTemplate() {
    if (this.driverTemplates !== null && this.workerTemplates !== null) {
      const driverTpl = this.driverTemplates[
        parseInt(this.state.driverTemplate, 10) - 1
      ];
      const workerTpl = this.workerTemplates[
        parseInt(this.state.workerTemplate, 10) - 1
      ];
      // compute driver overhead in Mb while ensuring Spark's minimum
      let driverMemoryOverheadMb = Math.max(
        driverTpl.memory * MEMORY_OVERHEAD_RATIO,
        this.jobParameters.driver_memory_overhead.validator.min,
      );
      if (
        driverMemoryOverheadMb + driverTpl.memory >
        this.jobParameters.driver_memory_overhead.validator.max
      ) {
        driverMemoryOverheadMb = this.jobParameters.driver_memory_overhead
          .validator.min;
      }
      // compute worker overhead in Mb while ensuring Spark's minimum
      let workerMemoryOverheadMb = Math.max(
        workerTpl.memory * MEMORY_OVERHEAD_RATIO,
        this.jobParameters.executor_memory_overhead.validator.min,
      );
      if (
        workerMemoryOverheadMb + workerTpl.memory >
        this.jobParameters.executor_memory_overhead.validator.max
      ) {
        workerMemoryOverheadMb = this.jobParameters.executor_memory_overhead
          .validator.min;
      }
      Object.assign(this.state, {
        driverCores: driverTpl.cores,
        driverMemoryGb: driverTpl.memory / GIB_IN_MIB,
        driverMemoryOverheadMb,
        workerCores: workerTpl.cores,
        workerMemoryGb: workerTpl.memory / GIB_IN_MIB,
        workerMemoryOverheadMb,
      });
    }
  }
}
