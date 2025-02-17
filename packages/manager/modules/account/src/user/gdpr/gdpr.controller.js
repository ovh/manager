import {
  CREATE_ERASURE_REQUEST_MESSAGES_MAP,
  GDPR_FEATURES_BANNER_CONTAINER,
  ERASURE_REQUEST_STATUS_MESSAGES_COLORS_MAP,
  ERASURE_INELIGIBILITY_REASON_MESSAGES_MAP,
  SUPPORT_URLS,
  CANCEL_ERASURE_REQUEST_MESSAGES_MAP,
  CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
  TRACKING_PAGE_CATEGORY,
  TRACKING_PAGE,
  TRACKING_PREFIX,
} from './gdpr.constants';

export default class UserAccountGdprController {
  /* @ngInject */
  constructor(
    $translate,
    gdprService,
    Alerter,
    coreConfig,
    $state,
    atInternet,
  ) {
    this.$translate = $translate;
    this.gdprService = gdprService;
    this.Alerter = Alerter;
    const user = coreConfig.getUser();
    this.nic = user?.nichandle;
    this.ovhSubsidiary = user?.ovhSubsidiary;
    this.$state = $state;
    this.atInternet = atInternet;
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
    this.trackAction('tile::button::delete_account');
  }

  closeErasureConfirmationModal() {
    if (this.loading.createErasureRequest) {
      return;
    }
    this.showErasureConfirmationModal = false;
    this.trackAction('tile::button::delete_account::cancel');
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
    this.trackAction('tile::button::delete_account::confirm');
    this.loading.createErasureRequest = true;
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .createErasureRequest()
      .then(() => {
        this.alerterInfo(
          this.buildSuccessMessage('gdpr_erasure_creation_success_emphasis'),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
        this.getErasureRequests();
        this.getCapabilities();
      })
      .catch((error) => {
        this.alerterError(
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
    this.trackAction('datagrid::button::get-code::delete_account');
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .sendErasureRequestConfirmationEmail(request.publicId)
      .then(() => {
        this.alerterInfo(
          `<strong>${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_title',
          )}</strong> ${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_description',
          )}`,
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      })
      .catch((error) => {
        this.alerterError(
          this.buildErrorMessage(
            error,
            CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
          ),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      });
  }

  cancelRequestErasure(request) {
    this.trackAction('datagrid::button::cancel::delete_account');
    this.Alerter.resetMessage(GDPR_FEATURES_BANNER_CONTAINER);
    this.gdprService
      .cancelRequestErasure(request.publicId)
      .then(() => {
        this.alerterInfo(
          this.buildSuccessMessage('gdpr_erasure_cancel_success'),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
        this.getErasureRequests();
        this.getCapabilities();
      })
      .catch((error) => {
        this.alerterError(
          this.buildErrorMessage(error, CANCEL_ERASURE_REQUEST_MESSAGES_MAP),
          GDPR_FEATURES_BANNER_CONTAINER,
        );
      });
  }

  trackAction(actionName) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${actionName}`,
      type: 'action',
      page_category: TRACKING_PAGE_CATEGORY,
      page: {
        name: TRACKING_PAGE,
      },
    });
  }

  trackBannerDisplay(bannerType, status) {
    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}::banner::${bannerType}::delete-account_${status}`,
      page_category: 'banner',
    });
  }

  alerterInfo(message, alertId) {
    this.Alerter.info(message, alertId);
    this.trackBannerDisplay('info', 'success');
  }

  alerterError(message, alertId) {
    this.Alerter.error(message, alertId);
    this.trackBannerDisplay('error', 'error');
  }
}
