import get from 'lodash/get';


import { MESSAGE_CONTAINER_NAME } from './add.constants';

export default class PciStreamsAddController {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;

    // other attributes
    this.model = {
      region: null,
      kind: null,
      name: null,
    };

    this.loading = {
      add: false,
    };

    this.messageHandler = null;
  }

  /* ================================
  =            Callbacks            =
  ================================= */

  onStepperFinish() {
    this.loading.add = true;

    return this.addStream({
      region: this.model.region.region,
      kind: this.model.kind,
      name: this.model.name,
      description: this.model.name,
    }).catch((error) => {
      this.loading.add = false;

      this.CucCloudMessage.error(
        this.$translate.instant('pci_projects_project_streams_add_error', {
          errorMessage: get(error, 'data.message'),
        }),
        MESSAGE_CONTAINER_NAME,
      );
    });
  }

  /* -----  End of Callbacks  ------ */

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGE_CONTAINER_NAME,
      {
        onMessage: this.refreshMessages.bind(this),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.loadMessages();
  }

  /* -----  End of Hooks  ------ */
}
