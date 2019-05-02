import { INSTANCE_HELP_REFERENCE_KEY } from './instances.constants';

export default class CloudProjectComputeInfrastructureListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    CucRegionService,
    ovhUserPref,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;

    return this.initLoaders();
  }

  initLoaders() {
    this.isLoading = true;

    this.loadMessages();
    return this.PciProjectsProjectInstanceService.getAll(this.projectId)
      .then((instances) => {
        this.instances = instances;
      })
      .then(() => this.checkHelpDisplay())
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.instances');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadInstanceDetail(instance) {
    return this.PciProjectsProjectInstanceService.getInstanceDetails(
      this.projectId,
      instance,
    );
  }

  checkHelpDisplay() {
    return new Promise((resolve) => {
      if (this.help) {
        return this.ovhUserPref.getValue(this.getHelpPreferenceKey())
          .then((value) => {
            this.displayHelp = value && this.help;
          })
          .catch(() => {
            this.displayHelp = this.help;
          })
          .finally(() => resolve());
      }
      return resolve();
    });
  }

  getHelpPreferenceKey() {
    return `${INSTANCE_HELP_REFERENCE_KEY}${this.help.toUpperCase()}`;
  }

  onHelpClosed(type) {
    if (type === this.displayHelp) {
      this.displayHelp = null;
    }
  }

  hideHelp(type) {
    if (type === this.displayHelp) {
      this.updateHelp = true;

      this.ovhUserPref.assign(this.getHelpPreferenceKey(), false)
        .then()
        .finally(() => {
          this.updateHelp = false;
          this.displayHelp = null;
        });
    }
  }
}
