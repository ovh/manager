export default class UserAccountGdprController {
  /* @ngInject */
  constructor(gdprService) {
    this.gdprService = gdprService;
    this.showErasureConfirmationModal = false;
  }

  $onInit() {
    this.loading = {
      capabilities: true,
    };
    this.gdprService
      .getCapabilities()
      .then((capabilities) => {
        this.capabilities = capabilities;
      })
      .finally(() => {
        this.loading.capabilities = false;
      });
  }

  askErasureConfirmation() {
    this.showErasureConfirmationModal = true;
  }

  closeErasureConfirmationModal() {
    this.showErasureConfirmationModal = false;
  }

  submitErasureRequest() {
    console.log('confirmed');
    // TODO: add spinner in the modal while creation is in progress
    this.gdprService
      .createErasureRequest()
      .then(() => {
        // TODO: manage the display of a success banner
      })
      .catch((error) => {
        // TODO: manage the display of an error banner
        console.log(error);
      })
      .finally(() => {
        this.showErasureConfirmationModal = false;
      });
  }
}
