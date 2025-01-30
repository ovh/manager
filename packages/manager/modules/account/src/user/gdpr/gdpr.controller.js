import {
  CREATE_ERASURE_REQUEST_MESSAGES_MAP,
  GDPR_FEATURES_BANNER_CONTAINER,
} from './gdpr.constants';

export default class UserAccountGdprController {
  /* @ngInject */
  constructor($translate, gdprService, Alerter, coreConfig) {
    this.$translate = $translate;
    this.gdprService = gdprService;
    this.Alerter = Alerter;
    this.nic = coreConfig.getUser()?.nichandle;
  }

  $onInit() {
    this.showErasureConfirmationModal = false;
    this.loading = {
      capabilities: false,
      createErasureRequest: false,
    };
    this.getCapabilities();
  }

  getCapabilities() {
    this.loading.capabilities = true;
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
    this.loading.createErasureRequest = true;
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .createErasureRequest()
      .then(() => {
        this.Alerter.info(
          this.getErasureCreationSuccessMessage(),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
        this.getCapabilities();
        // TODO: on success refresh requests
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant(
            CREATE_ERASURE_REQUEST_MESSAGES_MAP[error.status],
            {
              requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
            },
          ),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      })
      .finally(() => {
        this.loading.createErasureRequest = false;
        this.showErasureConfirmationModal = false;
      });
  }

  getErasureCreationSuccessMessage() {
    return `<strong>${this.$translate.instant(
      'gdpr_erasure_creation_success_emphasis',
    )}</strong>`;
  }
}
