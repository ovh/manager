angular.module('App').controller(
  'EmailProMXPlanMailingListsCreateCtrl',
  class EmailProMXPlanMailingListsCreateCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $q
     * @param $stateParams
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     * @param User
     */
    constructor($scope, $q, $stateParams, $translate, Alerter, EmailProMXPlanMailingLists, User) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
      this.User = User;
    }

    $onInit() {
      this.domain = _.get(this.$scope, 'exchange.associatedDomainName');
      this.mailingLists = this.$scope.currentActionData;

      this.constants = {
        nameMinLength: 2,
        nameMaxLength: 32,
        nameRegexPattern: /^\w+[\w.-]+\w*$/,
        MAILING_LIST: 'mailinglist',
        LAST_USER: 'lastuser',
        REPLY_TO_EMAIL: 'replyToEmail',
      };
      this.loading = {
        languages: false,
        guides: false,
      };
      this.model = {
        mlModerationMsg: null,
        mlSubscribersModeration: false,
        mlUsersPostOnly: false,
        replyTo: this.constants.MAILING_LIST,
      };
      this.replyToSelector = this.model.replyTo;

      this.$scope.summary = () => this.summary();
      this.$scope.createMailingList = () => this.createMailingList();

      this.getLanguages();
    }

    //---------
    // Step 1
    //---------

    getLanguages() {
      this.loading.languages = true;
      return this.$q
        .all({
          models: this.EmailProMXPlanMailingLists.getModels(),
          limits: this.EmailProMXPlanMailingLists.getMailingListLimits(this.model.mlModerationMsg),
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
          this.loading.languages = false;
        });
    }

    mlNameCheck(input) {
      input.$setValidity(
        'unique',
        this.mailingLists.length === 0
          || _.indexOf(this.mailingLists, this.model.mlName) === -1,
      );
    }

    emailCheck(input) {
      input.$setValidity(
        'email',
        this.EmailProMXPlanMailingLists.constructor.isMailValid(input.$viewValue),
      );
    }

    selectReplyTo() {
      this.model.replyTo = this.replyToSelector === this.constants.REPLY_TO_EMAIL
        ? ''
        : this.replyToSelector;
    }

    selectModerationMsg() {
      return this.EmailProMXPlanMailingLists.getMailingListLimits(
        this.model.mlModerationMsg,
        true,
      ).then((limits) => {
        this.limits = limits;
      });
    }

    //---------
    // Step 2
    //---------

    summary() {
      this.loading.guides = true;
      this.User.getUrlOf('guides')
        .then((guides) => {
          if (guides && guides.emailsCreateMailingListGuide) {
            this.guide = guides.emailsCreateMailingListGuide;
          }
        })
        .catch(() => {
          this.guide = null;
        })
        .finally(() => {
          this.loading.guides = false;
        });
    }

    //------------------------
    // Create account
    //------------------------

    createMailingList() {
      return this.EmailProMXPlanMailingLists.createMailingList(_.get(this.$scope, 'exchange.associatedDomainName'), {
        name: this.model.mlName,
        language: this.model.mlLanguage,
        ownerEmail: this.model.mlOwner,
        replyTo: this.model.replyTo,
        options: {
          moderatorMessage: !!this.model.mlModerationMsg,
          usersPostOnly:
            this.model.mlModerationMsg === null
              ? false
              : !this.model.mlModerationMsg,
          subscribeByModerator: this.model.mlSubscribersModeration,
        },
      })
        .then(() => this.Alerter.success(
          this.$translate.instant('mailing_list_tab_modal_create_list_success'),
          this.$scope.alerts.main,
        ))
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_create_list_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => this.$scope.resetAction());
    }
  },
);
