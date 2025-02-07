import {
  CREATE_ERASURE_REQUEST_MESSAGES_MAP,
  GDPR_FEATURES_BANNER_CONTAINER,
  ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP,
  ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP,
  SUPPORT_URLS,
  CANCEL_ERASURE_REQUEST_MESSAGES_MAP,
  CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
} from './gdpr.constants';

export default class UserAccountGdprController {
  /* @ngInject */
  constructor($translate, gdprService, Alerter, coreConfig, $state) {
    this.$translate = $translate;
    this.gdprService = gdprService;
    this.Alerter = Alerter;
    const user = coreConfig.getUser();
    this.nic = user?.nichandle;
    this.ovhSubsidiary = user?.ovhSubsidiary;
    this.$state = $state;
  }

  $onInit() {
    this.viewTicketsUrl = this.getViewTicketsUrl();
    this.showErasureConfirmationModal = false;
    this.loading = {
      capabilities: false,
      createErasureRequest: false,
    };
    this.getCapabilities();
    this.getErasureRequests();
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
    if (this.loading.createErasureRequest) {
      return;
    }
    this.showErasureConfirmationModal = false;
  }

  submitErasureRequest() {
    if (
      !(
        this.canCreateErasureRequest &&
        this.capabilities.canCreateErasureRequest
      )
    ) {
      return;
    }
    this.loading.createErasureRequest = true;
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .createErasureRequest()
      .then(() => {
        this.Alerter.info(
          this.buildSuccessMessage('gdpr_erasure_creation_success_emphasis'),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
        this.getErasureRequests();
        this.getCapabilities();
      })
      .catch((error) => {
        this.Alerter.error(
          this.buildErrorMessage(error, CREATE_ERASURE_REQUEST_MESSAGES_MAP),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      })
      .finally(() => {
        this.loading.createErasureRequest = false;
        this.showErasureConfirmationModal = false;
      });
  }

  buildSuccessMessage(key) {
    return `<strong>${this.$translate.instant(key)}</strong>`;
  }

  buildErrorMessage(error, mapMessages) {
    const requestId = error.headers('x-ovh-queryid');
    return `
        <p>${this.$translate.instant(mapMessages[error.status])}</p>
        ${
          requestId
            ? `<p>${this.$translate.instant(
                'gdpr_error_identifier',
              )} ${requestId}</p>`
            : ''
        }
    `;
  }

  getErasureRequests() {
    this.requests = [];
    this.gdprService.getRequests().then((requests) => {
      this.requests = requests;
    });
  }

  static getErasureRequestStatusColor(requestStatus) {
    return ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP[requestStatus].COLOR;
  }

  static getErasureRequestStatusMessage(requestStatus) {
    return ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP[requestStatus].MESSAGE;
  }

  static getErasureRequestReasonMessage(reasons) {
    if (!reasons) return '';
    if (reasons.length > 1)
      return ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP.multiple_reasons;
    if (reasons.length === 1)
      return ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP[reasons[0].key];
    return '';
  }

  getViewTicketsUrl() {
    return SUPPORT_URLS.viewTickets + this.ovhSubsidiary;
  }

  sendErasureRequestConfirmationEmail(request) {
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .sendErasureRequestConfirmationEmail(request.publicId)
      .then(() => {
        this.Alerter.info(
          `<strong>${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_title',
          )}</strong> ${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_description',
          )}`,
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.buildErrorMessage(
            error,
            CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
          ),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      });
  }

  cancelRequestErasure(request) {
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .cancelRequestErasure(request.publicId)
      .then(() => {
        this.Alerter.info(
          this.buildSuccessMessage('gdpr_erasure_cancel_success'),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
        this.getErasureRequests();
        this.getCapabilities();
      })
      .catch((error) => {
        this.Alerter.error(
          this.buildErrorMessage(error, CANCEL_ERASURE_REQUEST_MESSAGES_MAP),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      });
  }
}
