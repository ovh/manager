import get from 'lodash/get';

export default class MailingListsUpdateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $translate,
    Alerter,
    MailingLists,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.mailingList = angular.copy(this.$scope.currentActionData);
    this.mailingList.mlModerationMsg =
      !this.mailingList.options.moderatorMessage &&
      !this.mailingList.options.usersPostOnly
        ? null
        : this.mailingList.options.moderatorMessage;

    this.constants = {
      MAILING_LIST: 'mailinglist',
      LAST_USER: 'lastuser',
      REPLY_TO_EMAIL: 'replyToEmail',
    };
    this.loading = false;
    this.replyToSelector = this.mailingList.replyTo;

    this.$scope.updateMailingList = () => this.updateMailingList();

    this.getLanguages();
  }

  getLanguages() {
    this.loading = true;
    return this.$q
      .all({
        models: this.MailingLists.getModels(),
        limits: this.MailingLists.getMailingListLimits(
          this.mailingList.mlModerationMsg,
        ),
      })
      .then(({ models, limits }) => {
        this.languages = models.models['domain.DomainMlLanguageEnum'].enum;
        this.limits = limits;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_error'),
          err,
          this.$scope.alerts.main,
        );
        this.$scope.resetAction();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  emailCheck(input) {
    input.$setValidity(
      'email',
      this.MailingLists.constructor.isMailValid(input.$viewValue),
    );
  }

  selectReplyTo() {
    this.mailingList.replyTo =
      this.replyToSelector === this.constants.REPLY_TO_EMAIL
        ? ''
        : this.replyToSelector;
  }

  selectModerationMsg() {
    return this.MailingLists.getMailingListLimits(
      this.mailingList.mlModerationMsg,
      true,
    ).then((limits) => {
      this.limits = limits;
    });
  }

  updateMailingList() {
    this.loading = true;

    return this.MailingLists.updateMailingList(
      this.$stateParams.productId,
      this.mailingList.name,
      {
        infos: {
          language: this.mailingList.language,
          ownerEmail: this.mailingList.ownerEmail,
          replyTo: this.mailingList.replyTo,
        },
        options: {
          moderatorMessage: !!this.mailingList.mlModerationMsg,
          usersPostOnly:
            this.mailingList.mlModerationMsg === null
              ? false
              : !this.mailingList.mlModerationMsg,
          subscribeByModerator: this.mailingList.options.subscribeByModerator,
        },
      },
    )
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('mailing_list_tab_modal_update_list_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_update_list_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
