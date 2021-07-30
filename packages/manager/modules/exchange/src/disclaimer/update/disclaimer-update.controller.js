import angular from 'angular';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

export default class ExchangeUpdateDisclaimerCtrl {
  /* @ngInject */
  constructor(
    $document,
    $scope,
    wucExchange,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $document,
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
    };
    this.$routerParams = wucExchange.getParams();
    this.mceId = 'update-disclaimer-editor';
    this.data = angular.copy(navigation.currentActionData);
    this.loadOptions();

    $scope.saveDisclaimer = () => this.saveDisclaimer();
    $scope.isStep1Valid = () => this.isStep1Valid();
  }

  loadOptions() {
    this.loadingData = true;

    // Remove tabindex from modal as it clashes with ckeditor modal
    this.services.$document.find('.modal').removeAttr('tabindex');

    return this.services.wucExchange
      .getUpdateDisclaimerOptions()
      .then((data) => {
        this.availableAttributes = data.availableAttributes;

        if (!isEmpty(data.availableAttributes)) {
          this.data.selectedAttribute = head(data.availableAttributes);
        }
      })
      .finally(() => {
        this.loadingData = false;
      });
  }

  isStep1Valid() {
    return this.data.content && this.data.content.length < 5000;
  }

  /**
   * Insert attributes at text field current cursor position
   */
  insertAttribute() {
    this.data.content += `%%${this.data.selectedAttribute}%%`;
  }

  saveDisclaimer() {
    const model = {
      domain: this.data.domain.name,
      externalEmailsOnly: this.data.outsideOnly,
      content: this.data.content,
    };

    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .updateDisclaimer(
        this.$routerParams.organization,
        this.$routerParams.productId,
        model,
      )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_update_disclaimer_success_message',
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_update_disclaimer_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
