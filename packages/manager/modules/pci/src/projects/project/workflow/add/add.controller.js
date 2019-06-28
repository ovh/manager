import get from 'lodash/get';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    CucCloudMessage,
    CucRegionService,
    PciProjectsProjectInstanceService,
    OvhApiCloudProjectRegionWorkflowBackup,
    OvhApiCloudProjectRegion,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.OvhApiCloudProjectRegionWorkflowBackup = OvhApiCloudProjectRegionWorkflowBackup;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.workflow = {
      type: null,
      resource: null,
      schedule: null,
      name: null,
    };
    this.price = null;
    this.isAdding = false;
    this.isLoadingPriceEstimate = false;
    this.isEditingResource = false;
    this.isEditingSchedule = false;
    this.showRegionNotSupportedError = false;
  }

  $onInit() {
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
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.workflow.new', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getPriceEstimation() {
    this.isLoadingPriceEstimate = true;
    return this.PciProjectsProjectInstanceService
      .getBackupPriceEstimation(this.projectId, this.workflow.resource)
      .then((price) => {
        this.price = price;
        return price;
      })
      .finally(() => {
        this.isLoadingPriceEstimate = false;
      });
  }

  static getCronPattern(schedule) {
    return `${schedule.cronPattern.minutes} ${schedule.cronPattern.hour} ${schedule.cronPattern.dom} ${schedule.cronPattern.month} ${schedule.cronPattern.dow}`;
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
    this.createBackupWorkflow(workflow, this.workflow.resource.region)
      .then(() => this.goToHomePage(
        this.$translate.instant('pci_workflow_add_success', { workflowName: workflow.name }),
      ))
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
    return this.OvhApiCloudProjectRegionWorkflowBackup.v6().save({
      serviceName: this.projectId,
      regionName,
    }, workflow).$promise;
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
