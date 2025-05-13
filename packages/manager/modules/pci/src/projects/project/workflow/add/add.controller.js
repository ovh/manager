import get from 'lodash/get';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    CucCloudMessage,
    ovhManagerRegionService,
    OvhApiCloudProjectRegion,
    OvhApiCloudProjectRegionWorkflowBackup,
    PciProjectsProjectInstanceService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.OvhApiCloudProjectRegionWorkflowBackup = OvhApiCloudProjectRegionWorkflowBackup;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  static getCronPattern(schedule) {
    return `${schedule.cronPattern.minutes} ${schedule.cronPattern.hour} ${schedule.cronPattern.dom} ${schedule.cronPattern.month} ${schedule.cronPattern.dow}`;
  }

  $onInit() {
    this.isAdding = false;
    this.isLoadingPriceEstimate = false;
    this.isEditingResource = false;
    this.isEditingSchedule = false;
    this.price = null;
    this.showRegionNotSupportedError = false;
    this.workflow = {
      type: null,
      resource: null,
      schedule: null,
      name: null,
    };
    if (this.selectedInstance) {
      this.workflow.resource = this.selectedInstance;
      if (this.initialStep === 1) {
        this.showRegionNotSupportedError = true;
      }
      this.getPriceEstimation();
    }
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.workflow.new');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.workflow.new',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getPriceEstimation() {
    this.isLoadingPriceEstimate = true;
    return this.PciProjectsProjectInstanceService.getSnapshotMonthlyPrice(
      this.projectId,
      this.workflow.resource,
      this.catalogEndpoint,
    )
      .then((price) => {
        this.price = price;
        return price;
      })
      .finally(() => {
        this.isLoadingPriceEstimate = false;
      });
  }

  add() {
    this.isAdding = true;
    const workflow = {
      instanceId: this.workflow.resource.id,
      cron: this.constructor.getCronPattern(this.workflow.schedule),
      name: this.workflow.name,
      rotation: this.workflow.schedule.rotation,
    };
    if (this.workflow.schedule.maxExecutionCount) {
      workflow.maxExecutionCount = this.workflow.schedule.maxExecutionCount;
    }
    return this.createBackupWorkflow(workflow, this.workflow.resource.region)
      .then(() =>
        this.goToHomePage(
          this.$translate.instant('pci_workflow_add_success', {
            workflowName: workflow.name,
          }),
        ),
      )
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_workflow_add_error', {
            message: get(error, 'data.message'),
          }),
        );
        this.$window.scrollTo(0, 0);
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  createBackupWorkflow(workflow, regionName) {
    return this.OvhApiCloudProjectRegionWorkflowBackup.v6().save(
      {
        serviceName: this.projectId,
        regionName,
      },
      workflow,
    ).$promise;
  }

  onResourceFocus() {
    this.isEditingResource = true;
  }

  onResourceSubmit(form) {
    if (this.isWorkflowSupportedOnRegion(this.workflow.resource.region)) {
      this.showRegionNotSupportedError = false;
      this.isEditingResource = false;
      this.getPriceEstimation();
      return;
    }
    this.showRegionNotSupportedError = true;
    set(form, '$valid', false);
  }

  onScheduleFocus() {
    this.isEditingSchedule = true;
  }

  onScheduleSubmit() {
    this.isEditingSchedule = false;
  }
}
