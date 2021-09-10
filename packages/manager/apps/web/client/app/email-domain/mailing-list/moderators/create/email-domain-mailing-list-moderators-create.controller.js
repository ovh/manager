import uniq from 'lodash/uniq';

export default class MailingListsCreateModeratorCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MailingLists) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
  }

  $onInit() {
    this.errors = [];
    this.mailingList = angular.copy(this.$scope.currentActionData.mailingList);
    this.moderators = angular.copy(this.$scope.currentActionData.moderators);
    this.loading = false;
    this.selection = [];

    this.$scope.createModerator = () => this.createModerator();
  }

  static addressValidator(addr) {
    return validator.isEmail(addr) && /^[\w@.-]+$/.test(addr);
  }

  createModerator() {
    this.loading = true;
    const moderatorsToAdd = uniq(this.selection);

    return this.MailingLists.addModerators(this.$stateParams.productId, {
      mailingList: this.mailingList.name,
      users: moderatorsToAdd,
      type: 'moderator',
    })
      .then((tasks) => {
        this.Alerter.alertFromSWSBatchResult(
          {
            OK: this.$translate.instant(
              moderatorsToAdd.length === 1
                ? 'mailing_list_tab_modal_create_moderator_success'
                : 'mailing_list_tab_modal_create_moderators_success',
            ),
            PARTIAL: this.$translate.instant(
              'mailing_list_tab_modal_create_moderators_error',
            ),
            ERROR: this.$translate.instant(
              'mailing_list_tab_modal_create_moderators_error',
            ),
          },
          tasks,
          this.$scope.alerts.main,
        );

        this.MailingLists.pollState(this.$stateParams.productId, {
          id: tasks.task,
          mailingList: this.mailingList,
          successStates: ['noState'],
          namespace: 'mailingLists.moderators.poll',
        });
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            moderatorsToAdd.length === 1
              ? 'mailing_list_tab_modal_create_moderator_error'
              : 'mailing_list_tab_modal_create_moderators_error',
          ),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
