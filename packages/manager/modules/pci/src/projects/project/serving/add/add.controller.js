import get from 'lodash/get';

export default class PciServingAddController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;

    // other attributes
    this.model = {
      region: null,
      description: null,
      container: null,
    };

    this.loading = false;

    this.messageHandler = null;
  }

  /* ================================
  =            Callbacks            =
  ================================= */

  onStepperFinish() {
    this.loading = true;
    return this.addNamespace({
      region: this.model.region.region.name,
      description: this.model.description,
      container: this.model.container,
    }).catch((error) => {
      this.loading = false;

      this.CucCloudMessage.error(
        this.$translate.instant('pci_projects_project_serving_add_error', {
          errorMessage: get(error, 'data.message'),
        }),
        'pci.projects.project.serving.add',
      );
    });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving.add',
      {
        onMessage: this.refreshMessages.bind(this),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  $onInit() {
    this.loadMessages();
  }
}
