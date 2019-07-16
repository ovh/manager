angular.module('App').controller(
  'EmailProMXPlanMailingListsUpdateCtrl',
  class EmailProMXPlanMailingListsUpdateCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $q
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     * @param User
     */
    constructor($scope, $q, $translate, Alerter, EmailProMXPlanMailingLists, User) {
      this.$scope = $scope;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
      this.User = User;
    }

    $onInit() {
      this.mailingList = angular.copy(this.$scope.currentActionData);
      this.mailingList.mlModerationMsg = !this.mailingList.options.moderatorMessage
        && !this.mailingList.options.usersPostOnly
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
          models: this.EmailProMXPlanMailingLists.getModels(),
          limits: this.EmailProMXPlanMailingLists
            .getMailingListLimits(this.mailingList.mlModerationMsg),
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
        this.EmailProMXPlanMailingLists.constructor.isMailValid(input.$viewValue),
      );
    }

    selectReplyTo() {
      this.mailingList.replyTo = this.replyToSelector === this.constants.REPLY_TO_EMAIL
        ? ''
        : this.replyToSelector;
    }

    selectModerationMsg() {
      return this.EmailProMXPlanMailingLists.getMailingListLimits(
        this.mailingList.mlModerationMsg,
        true,
      ).then((limits) => {
        this.limits = limits;
      });
    }

    updateMailingList() {
      this.loading = true;

      return this.EmailProMXPlanMailingLists.updateMailingList(
        this.$scope.exchange.associatedDomainName,
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
        .then(() => this.Alerter.success(
          this.$translate.instant('mailing_list_tab_modal_update_list_success'),
          this.$scope.alerts.main,
        ))
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_update_list_error'),
          _.get(err, 'data', err),
          this.$scope.alerts.main,
        ))
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
