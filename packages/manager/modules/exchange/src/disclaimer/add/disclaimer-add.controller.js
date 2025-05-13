import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';

export default class ExchangeAddDisclaimerCtrl {
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

    this.mceId = 'add-disclaimer-editor';
    this.$routerParams = wucExchange.getParams();

    this.data = {
      content: '',
      outsideOnly: false,
      selectedVariable: 'Name',
    };

    this.loadAvailableDomains();

    $scope.saveDisclaimer = () => this.saveDisclaimer();
    $scope.isStep1Valid = () => this.isStep1Valid();
  }

  loadAvailableDomains() {
    this.loadingData = true;

    // Remove tabindex from modal as it clashes with ckeditor modal
    this.services.$document.find('.modal').removeAttr('tabindex');

    return this.services.wucExchange
      .getNewDisclaimerOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((data) => {
        this.loadingData = false;

        if (data.availableDomains) {
          this.availableDomains = data.availableDomains;
          this.selectCurrentDomain();

          this.data.selectedAttribute = head(data.availableAttributes);
          this.availableAttributes = data.availableAttributes;
        } else {
          this.services.navigation.resetAction();
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_ACTION_add_disclaimer_no_domains',
            ),
          );
        }
      });
  }

  selectCurrentDomain() {
    if (get(this.services.navigation, 'currentActionData.domain.name')) {
      this.data.completeDomain = find(this.availableDomains, {
        name: this.services.navigation.currentActionData.domain.name,
      });
    }
    if (!this.data.completeDomain) {
      this.data.completeDomain = head(this.availableDomains);
    }
  }

  isStep1Valid() {
    return (
      this.data.completeDomain &&
      this.data.content &&
      this.data.content.length < 5000
    );
  }

  /**
   * Insert attributes at text field current cursor position
   */
  insertAttribute() {
    this.data.content += `%%${this.data.selectedAttribute}%%`;
  }

  saveDisclaimer() {
    const model = {
      domain: this.data.completeDomain.name,
      externalEmailsOnly: this.data.outsideOnly,
      content: this.data.content,
    };

    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .saveDisclaimer(
        this.$routerParams.organization,
        this.$routerParams.productId,
        model,
      )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_add_disclaimer_success_message',
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_disclaimer_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
