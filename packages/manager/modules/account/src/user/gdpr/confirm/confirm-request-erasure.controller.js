import {
  GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
  CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
  CONFIRM_ERASURE_REQUEST_MESSAGES_MAP,
} from '../gdpr.constants';

export default class ConfirmRequestErasureController {
  /* @ngInject */
  constructor(
    $translate,
    Alerter,
    gdprService,
    $state,
    ssoAuthentication,
    $window,
  ) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.gdprService = gdprService;
    this.$state = $state;
    this.ssoAuthentication = ssoAuthentication;
    this.$window = $window;
  }

  $onInit() {
    this.loading = {
      confirm: false,
      sendConfirmEmail: false,
    };

    this.model = {
      confirm_code: '',
    };
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

  sendErasureRequestConfirmationEmail() {
    this.Alerter.resetMessage(GDPR_FEATURES_CONFIRM_BANNER_CONTAINER);
    this.loading.sendConfirmEmail = true;
    this.gdprService
      .sendErasureRequestConfirmationEmail(this.publicId)
      .then(() => {
        this.Alerter.info(
          `<strong>${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_title',
          )}</strong> ${this.$translate.instant(
            'gdpr_erasure_confirmation_email_sent_success_description',
          )}`,
          GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.buildErrorMessage(
            error,
            CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
          ),
          GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
        );
      })
      .finally(() => {
        this.loading.sendConfirmEmail = false;
      });
  }

  submitConfirmation() {
    if (this.model.confirm_code) {
      this.loading.confirm = true;
      this.Alerter.resetMessage(GDPR_FEATURES_CONFIRM_BANNER_CONTAINER);

      this.gdprService
        .confirmErasure(this.publicId, this.model.confirm_code)
        .then(() => this.ssoAuthentication.logout())
        .catch((error) => {
          this.Alerter.error(
            this.buildErrorMessage(error, CONFIRM_ERASURE_REQUEST_MESSAGES_MAP),
            GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
          );
        })
        .finally(() => {
          this.loading.confirm = false;
        });
    }
  }

  cancelConfirmation() {
    this.$window.location.href = this.$state.href('account.user.gdpr');
  }
}
