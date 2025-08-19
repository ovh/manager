import {
  GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
  CONFIRMATION_EMAIL_ERASURE_REQUEST_MESSAGES_MAP,
  CONFIRM_ERASURE_REQUEST_MESSAGES_MAP,
  TRACKING_CONFIRM_PAGE_CATEGORY,
  TRACKING_CONFIRM_PAGE,
  TRACKING_PREFIX,
  TRACKING_LEVEL2,
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
    atInternet,
  ) {
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.gdprService = gdprService;
    this.$state = $state;
    this.ssoAuthentication = ssoAuthentication;
    this.$window = $window;
    this.atInternet = atInternet;
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
      this.trackAction('button::delete_account::confirm');

      this.gdprService
        .confirmErasure(this.publicId, this.model.confirm_code)
        .then(() =>
          this.ssoAuthentication.logout(
            this.$state.href('account.user.gdpr', {}, { absolute: true }),
          ),
        )
        .catch((error) => {
          this.Alerter.error(
            this.buildErrorMessage(error, CONFIRM_ERASURE_REQUEST_MESSAGES_MAP),
            GDPR_FEATURES_CONFIRM_BANNER_CONTAINER,
          );
          this.trackErrorBannerDisplay();
        })
        .finally(() => {
          this.loading.confirm = false;
        });
    }
  }

  cancelConfirmation() {
    this.trackAction('button::delete_account::cancel');
    this.$window.location.href = this.$state.href('account.user.gdpr');
  }

  trackAction(actionName) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::tile::${actionName}`,
      type: 'action',
      page_category: TRACKING_CONFIRM_PAGE_CATEGORY,
      page: {
        name: TRACKING_CONFIRM_PAGE,
      },
      level2: TRACKING_LEVEL2,
    });
  }

  trackErrorBannerDisplay() {
    this.atInternet.trackPage({
      name: `${TRACKING_PREFIX}::user::banner-error::confirmation-code-delete-account_error`,
      page_category: 'banner',
      level2: TRACKING_LEVEL2,
    });
  }
}
