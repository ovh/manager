import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export default class ExchangeAddOutlookCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    exchangeAccountOutlook,
    constants,
    $window,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      exchangeAccountOutlook,
      constants,
      $window,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.selectedAccount = navigation.currentActionData;

    this.model = {
      primaryEmailAddress: this.selectedAccount.primaryEmailAddress,
      contractsValidated: false,
    };

    $scope.displayOutlookOrder = () => this.displayOutlookOrder();
    $scope.isStep1Valid = () => this.isStep1Valid();
    $scope.isStep2Valid = () => this.isStep2Valid();
    $scope.loadOptionsList = () => this.loadOptionsList();
    $scope.orderOutlook = () => this.orderOutlook();
  }

  isStep1Valid() {
    return (
      this.model.licenceVersion != null &&
      this.model.duration != null &&
      this.selectedOption != null &&
      this.selectedOption.contractsValidated
    );
  }

  isStep2Valid() {
    return this.previewOrder != null && this.previewOrder.url;
  }

  loadOptionsList() {
    this.services.exchangeAccountOutlook
      .getLicenceOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedAccount.primaryEmailAddress,
      )
      .then((data) => {
        this.optionsList = data;
        this.selectVersion(data[0]);
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_outlook_step2_error_message',
          ),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  selectVersion(version) {
    this.selectedVersion = version;
    this.model.licenceVersion = this.selectedVersion.version;

    if (this.model.duration != null) {
      // keep the selection of duration, if it exists in the new selectioned license version
      const option = find(
        version.options,
        (opt) => opt.duration.duration === this.model.duration,
      );

      this.selectDuration(option);
    }
  }

  selectDuration(option) {
    if (option != null) {
      this.selectedOption = option;
    }

    // if no selected option, no contracts to validate
    if (this.selectedOption == null) {
      return;
    }

    this.selectedOption.contractsValidated = isEmpty(
      this.selectedOption.order.contracts,
    );
  }

  orderOutlook() {
    this.services.exchangeAccountOutlook
      .orderOutlook(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.model,
      )
      .then((data) => {
        this.previewOrder = data;
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_outlook_step2_error_message',
          ),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  displayOutlookOrder() {
    this.services.navigation.resetAction();
    this.services.$window.open(this.previewOrder.url, '_blank');
  }

  getTarget() {
    return this.services.constants.target;
  }
}
