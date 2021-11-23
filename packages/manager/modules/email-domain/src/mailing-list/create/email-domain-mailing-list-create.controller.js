import indexOf from 'lodash/indexOf';
import get from 'lodash/get';

const emailsCreateMailingListGuide = {
  FR:
    'https://www.ovh.com/fr/g1596.mail_mutualise_guide_dutilisation_mailing-list',
  IT: 'https://www.ovh.it/g1596.mail_mutualise_guide_dutilisation_mailing-list',
  LT: 'https://www.ovh.lt/g1596.mail_mutualise_guide_dutilisation_mailing-list',
  PL: 'https://www.ovh.pl/g1596.mail_mutualise_guide_dutilisation_mailing-list',
  PT: 'https://www.ovh.pt/g1596.mail_mutualise_guide_dutilisation_mailing-list',
};

export default class MailingListsCreateCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $translate,
    coreConfig,
    Alerter,
    MailingLists,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.domain = this.$stateParams.productId;
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
        models: this.MailingLists.getModels(),
        limits: this.MailingLists.getMailingListLimits(
          this.model.mlModerationMsg,
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
        this.loading.languages = false;
      });
  }

  mlNameCheck(input) {
    input.$setValidity(
      'unique',
      this.mailingLists.length === 0 ||
        indexOf(this.mailingLists, this.model.mlName) === -1,
    );
  }

  emailCheck(input) {
    input.$setValidity(
      'email',
      this.MailingLists.constructor.isMailValid(input.$viewValue),
    );
  }

  selectReplyTo() {
    this.model.replyTo =
      this.replyToSelector === this.constants.REPLY_TO_EMAIL
        ? ''
        : this.replyToSelector;
  }

  selectModerationMsg() {
    return this.MailingLists.getMailingListLimits(
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
    this.guide = null;

    if (this.coreConfig.isRegion('EU')) {
      this.guide = get(
        emailsCreateMailingListGuide,
        this.coreConfig.getUser().ovhSubsidiary,
        emailsCreateMailingListGuide.FR,
      );
    }
  }

  //------------------------
  // Create account
  //------------------------

  createMailingList() {
    return this.MailingLists.createMailingList(this.$stateParams.productId, {
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
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('mailing_list_tab_modal_create_list_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_create_list_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }
}
