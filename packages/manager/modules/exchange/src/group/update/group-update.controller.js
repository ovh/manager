import camelCase from 'lodash/camelCase';
import find from 'lodash/find';
import has from 'lodash/has';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

export default class ExchangeUpdateGroupCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, group, navigation, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      group,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.selectedGroup = navigation.currentActionData;
    if (
      has(this.selectedGroup, 'mailingListAddress') &&
      this.selectedGroup.mailingListAddress != null
    ) {
      const atSignIndex = this.selectedGroup.mailingListAddress.indexOf('@');

      if (atSignIndex != null) {
        this.selectedGroup.address = this.selectedGroup.mailingListAddress.substring(
          0,
          atSignIndex,
        );
        this.domain = this.selectedGroup.mailingListAddress.substring(
          atSignIndex + 1,
          this.selectedGroup.mailingListAddress.length,
        );
      }
    }

    this.selectedGroup.maxSendSize = Math.min(
      this.selectedGroup.maxSendSize,
      100,
    );
    this.selectedGroup.sentSizeUnlimited =
      this.selectedGroup.maxSendSize === 0 ||
      Number.isNaN(this.selectedGroup.maxSendSize);
    this.selectedGroup.maxReceiveSize = Math.min(
      this.selectedGroup.maxReceiveSize,
      100,
    );
    this.selectedGroup.receiveSizeUnlimited =
      this.selectedGroup.maxReceiveSize === 0 ||
      Number.isNaN(this.selectedGroup.maxReceiveSize);

    // initialize the model with current domain
    this.groupOptions = {
      availableDomains: null,
    };

    this.model = {};

    this.groupOptions.availableJoinRestrictions = [
      this.selectedGroup.joinRestriction,
    ];
    this.groupOptions.availableDepartRestrictions = [
      this.selectedGroup.departRestriction,
    ];
    this.groupOptions.availableDomains = [
      {
        displayName: this.domain,
        formattedName: this.domain,
        name: this.domain,
      },
    ];

    this.selectedGroup.completeDomain = head(
      this.groupOptions.availableDomains,
    );

    $scope.retrievingOptionsToCreateNewGroup = () =>
      this.retrievingOptionsToCreateNewGroup();
    $scope.groupIsValid = () => this.groupIsValid();
    $scope.updateExchangeGroup = () => this.updateExchangeGroup();
  }

  prepareModel() {
    this.model = {
      displayName:
        this.selectedGroup.displayName === ''
          ? null
          : this.selectedGroup.displayName,
      mailingListAddress: `${this.selectedGroup.address}@${this.selectedGroup.completeDomain.name}`,
      senderAuthentification: this.selectedGroup.senderAuthentification,
      hiddenFromGAL: this.selectedGroup.hiddenFromGAL,
      maxSendSize: this.selectedGroup.sentSizeUnlimited
        ? null
        : this.selectedGroup.maxSendSize,
      maxReceiveSize: this.selectedGroup.receiveSizeUnlimited
        ? null
        : this.selectedGroup.maxReceiveSize,
      joinRestriction: camelCase(this.selectedGroup.joinRestriction),
      departRestriction: camelCase(this.selectedGroup.departRestriction),
      company:
        this.selectedGroup.company === '' ? null : this.selectedGroup.company,
    };
  }

  retrievingOptionsToCreateNewGroup() {
    this.services.group
      .retrievingOptionsToCreateNewGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((data) => {
        this.groupOptions = data;

        if (isEmpty(data.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_add_no_domains'),
          );

          this.services.navigation.resetAction();
        } else {
          this.selectedGroup.completeDomain = find(
            this.groupOptions.availableDomains,
            {
              name: this.selectedGroup.completeDomain.name,
            },
          );
        }
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_option_fail',
          ),
          failure,
        );
      });
  }

  updateExchangeGroup() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );
    this.prepareModel();
    this.services.wucExchange
      .updateGroup(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedGroup.mailingListAddress,
        this.model,
      )
      .then((data) => {
        const addGroupMessages = {
          OK: this.services.$translate.instant(
            'exchange_GROUPS_settings_success_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          PARTIAL: this.services.$translate.instant(
            'exchange_GROUPS_settings_partial_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          ERROR: this.services.$translate.instant(
            'exchange_GROUPS_settings_error_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
        };

        if (data == null) {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant(
              'exchange_GROUPS_settings_success_message',
              {
                t0: this.selectedGroup.mailingListDisplayName,
              },
            ),
          );
        } else {
          this.services.messaging.setMessage(addGroupMessages, data);
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_GROUPS_settings_error_message',
            {
              t0: this.selectedGroup.mailingListDisplayName,
            },
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  groupIsValid() {
    const hasGroupOptions = this.groupOptions != null;
    const hasCompleteDomain = this.selectedGroup.completeDomain != null;
    const hasAddress = this.selectedGroup.address != null;
    const receiveSizeIsCorrect =
      this.selectedGroup.receiveSizeUnlimited ||
      (this.selectedGroup.maxReceiveSize &&
        /^\d+$/.test(this.selectedGroup.maxReceiveSize));
    const sentSizeIsCorrect =
      this.selectedGroup.sentSizeUnlimited ||
      (this.selectedGroup.maxSendSize &&
        /^\d+$/.test(this.selectedGroup.maxSendSize));

    return (
      hasGroupOptions &&
      hasCompleteDomain &&
      hasAddress &&
      receiveSizeIsCorrect &&
      sentSizeIsCorrect
    );
  }
}
