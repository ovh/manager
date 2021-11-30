import get from 'lodash/get';

export default class MailingListsSendListByEmailCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, MailingLists) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.MailingLists = MailingLists;
  }

  $onInit() {
    this.email = '';
    this.mailingList = this.$scope.currentActionData;
    this.loading = false;
    this.$scope.sendListByEmail = () => this.sendListByEmail();
  }

  emailCheck(input) {
    input.$setValidity(
      'email',
      this.MailingLists.constructor.isMailValid(input.$viewValue),
    );
  }

  sendListByEmail() {
    this.loading = true;
    return this.MailingLists.sendListByEmail(this.$stateParams.productId, {
      name: this.mailingList.name,
      email: this.email,
    })
      .then((task) => {
        this.Alerter.success(
          this.$translate.instant(
            'mailing_list_tab_modal_sendListByEmail_success',
            { t0: this.email },
          ),
          this.$scope.alerts.main,
        );

        // no return here
        this.MailingLists.pollState(this.$stateParams.productId, {
          id: task.id,
          successStates: ['noState'],
          namespace: 'mailingLists.subscribers.sendListByEmail.poll',
        });
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'mailing_list_tab_modal_sendListByEmail_error',
          ),
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
