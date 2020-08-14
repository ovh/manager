import some from 'lodash/some';

export default class ExchangeDisclaimerCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, $translate, exchangeStates) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      $translate,
      exchangeStates,
    };
  }

  $onInit() {
    const params = this.services.wucExchange.getParams();
    this.organization = params.organization;
    this.productId = params.productId;

    this.services.$scope.$on(
      this.services.wucExchange.events.disclaimersChanged,
      () => this.refreshList(),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  hasEmptySlot(list) {
    return some(list, (item) => item.emptySlotFlag);
  }

  getDisclaimers({ pageSize, offset }) {
    return this.services.wucExchange.getDisclaimers(
      this.organization,
      this.productId,
      pageSize,
      offset - 1,
    );
  }

  refreshList() {
    if (!this.disclaimersList) {
      return undefined;
    }
    const config = { pageSize: this.pageSize, offset: this.offset };
    return this.getDisclaimers(config)
      .then((disclaimers) => {
        for (let i = 0; i < disclaimers.list.results.length; i += 1) {
          this.disclaimersList.splice(i, 1, disclaimers.list.results[i]);
        }
        for (
          let i = disclaimers.list.results.length;
          i < this.disclaimersList.length;
          i += 1
        ) {
          this.disclaimersList.splice(i, 1);
        }
        this.setMessagesFlags(this.disclaimers);
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_DISCLAIMER_error_message',
          ),
          err,
        );
      });
  }

  loadPaginated($config) {
    this.disclaimersList = null;
    this.pageSize = $config.pageSize;
    this.offset = $config.offset;
    return this.getDisclaimers($config)
      .then((disclaimers) => {
        this.disclaimersList = disclaimers.list.results;
        this.setMessagesFlags(this.disclaimers);
        return {
          data: this.disclaimersList,
          meta: {
            totalCount: disclaimers.count,
          },
        };
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_DISCLAIMER_error_message',
          ),
          err,
        );
      });
  }

  setMessagesFlags() {
    this.addDomainMessageFlag = !this.newDisclaimersDisabled();
  }

  newDisclaimersDisabled() {
    return !this.disclaimersList || !this.hasEmptySlot(this.disclaimersList);
  }

  addDisclaimer(disclaimer) {
    if (!this.newDisclaimersDisabled()) {
      this.services.navigation.setAction(
        'exchange/disclaimer/add/disclaimer-add',
        disclaimer,
      );
    }
  }

  updateDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      this.services.navigation.setAction(
        'exchange/disclaimer/update/disclaimer-update',
        disclaimer,
      );
    }
  }

  deleteDisclaimer(disclaimer) {
    if (!disclaimer.taskPendingId) {
      this.services.navigation.setAction(
        'exchange/disclaimer/remove/disclaimer-remove',
        disclaimer,
      );
    }
  }
}
