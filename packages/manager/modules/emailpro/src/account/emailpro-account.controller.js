import angular from 'angular';

import filter from 'lodash/filter';
import find from 'lodash/find';
import set from 'lodash/set';
import punycode from 'punycode';

import {
  SIZE_UNIT,
  STATE_TASK_DOING,
  STATE_TASK_ERROR,
  ACCOUNT_TYPES,
  FILTER_TYPE,
  SUPPORT_URL_VIEW_TICKETS,
} from './emailpro-constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    coreURLBuilder,
    goToAccounts,
    goToAliases,
    EmailPro,
    WucConverterService,
    coreConfig,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.goToAccounts = goToAccounts;
    this.goToAliases = goToAliases;
    this.EmailPro = EmailPro;
    this.WucConverterService = WucConverterService;
    this.coreConfig = coreConfig;

    this.$scope.stateCreating = EmailPro.stateCreating;
    this.$scope.stateDeleting = EmailPro.stateDeleting;
    this.$scope.stateOk = EmailPro.stateOk;
    this.$scope.stateReopening = EmailPro.stateReopening;
    this.$scope.stateSuspended = EmailPro.stateSuspended;
    this.$scope.stateSuspending = EmailPro.stateSuspending;
    this.$scope.stateTaskError = STATE_TASK_ERROR;
    this.$scope.stateTaskDoing = STATE_TASK_DOING;
    this.$scope.SIZE_UNIT = SIZE_UNIT;

    this.$scope.exchangeTypeHosted = EmailPro.accountTypeHosted;
    this.$scope.exchangeTypeDedicated = EmailPro.accountTypeDedicated;
    this.$scope.exchangeTypeProvider = EmailPro.accountTypeProvider;

    this.$scope.accountTypes = ACCOUNT_TYPES;
    this.$scope.filterType = FILTER_TYPE;

    this.$scope.setFilter = function setFilter() {
      this.$scope.$broadcast(
        'paginationServerSide.loadPage',
        1,
        'accountsTable',
      );
    };

    this.$scope.search = { value: null };
  }

  $onInit() {
    this.$scope.user = this.coreConfig.getUser();
    this.$scope.loading = false;
    this.$scope.accounts = null;
    this.$scope.loadingNewConfiguredAccount = false;

    this.$scope.showAccounts = true;
    this.$scope.selectedAccount = null;
    this.$scope.noDomainFlag = true;
    this.$scope.newConfiguredAccount = [];

    this.$scope.spamTooltipContent = this.$translate.instant(
      'emailpro_tab_ACCOUNTS_popover_span_text',
      {
        t0: SUPPORT_URL_VIEW_TICKETS + this.$scope.user.ovhSubsidiary,
      },
    );

    this.$scope.$watch('search.value', (search) => {
      if (this.$scope.search) {
        if (this.$scope.search.value === search) {
          this.$scope.$broadcast(
            'paginationServerSide.loadPage',
            1,
            'accountsTable',
          );
        }
      }
    });

    this.$scope.getAccounts = (count, offset) => {
      this.$scope.setMessage(null);
      this.$scope.loading = true;

      this.EmailPro.getAccounts(
        count,
        offset,
        this.$scope.search.value,
        this.$scope.exchange.isMXPlan ? 1 : 0,
        this.$scope.filterType === 'ALL' ? null : this.$scope.filterType,
      ).then(
        (accounts) => {
          this.$scope.loading = false;
          this.$scope.accounts = accounts;

          let act;
          for (let i = 0, c = accounts.list.results.length; i < c; i += 1) {
            act = accounts.list.results[i];
            act.percentUse = Math.round(
              // eslint-disable-next-line no-restricted-properties
              ((act.currentUsage / Math.pow(1024, 2)) * 100) / act.quota,
            );
          }
        },
        (failure) => {
          this.$scope.loading = false;
          this.$scope.setMessage(
            this.$translate.instant('emailpro_tab_ACCOUNTS_error_message'),
            failure,
          );
        },
      );
    };

    this.$scope.$on(this.EmailPro.events.accountsChanged, () => {
      this.$scope.$broadcast('paginationServerSide.reload', 'accountsTable');
    });

    // this.$scope.$on('showAccounts', () => {
    //   this.$scope.displayAccounts();
    // });

    this.$scope.addAccountOptionIsNotAvailable = () => {
      return (
        this.$scope.exchange.nicType.indexOf(this.EmailPro.nicAdmin) === -1 &&
        this.$scope.exchange.nicType.indexOf(this.EmailPro.nicTech) === -1
      );
    };

    this.$scope.isNewAccountOrder = () => {
      if (this.$scope.is25g()) {
        return true;
      }
      if (this.$scope.exchange.offer === this.$scope.exchangeTypeDedicated) {
        return false;
      }
      if (
        this.$scope.exchange.offer === this.$scope.exchangeTypeProvider &&
        this.$scope.exchange.serverDiagnostic.version ===
          this.EmailPro.EmailPro2010Code
      ) {
        return false;
      }
      return true;
    };

    this.$scope.newAccount = () => {
      if (this.$scope.isNewAccountOrder()) {
        this.$scope.setAction('emailpro/account/order/emailpro-account-order');
      } else {
        this.$scope.setAction('emailpro/account/add/emailpro-account-add');
      }
    };

    this.$scope.isEditable = (account) => {
      return (
        (account.state === this.$scope.stateOk ||
          account.state === this.$scope.stateTaskDoing ||
          account.state === this.$scope.stateTaskError) &&
        !this.$scope.noDomainFlag
      );
    };

    this.$scope.isConfigurable = (account) => {
      return account.canBeConfigured;
    };

    this.$scope.editAccount = (account) => {
      const populateAccount = angular.copy(account);

      populateAccount.is25g = this.$scope.is25g();

      if (this.$scope.isEditable(account)) {
        this.$scope.setAction(
          'emailpro/account/update/emailpro-account-update',
          populateAccount,
        );
      }
    };

    this.$scope.displayAccounts = () => {
      this.$scope.search = { value: null };
      this.$scope.showAccounts = true;
      this.$scope.selectedAccount = null;
      this.goToAccounts();
    };

    this.$scope.showAliases = (account) => {
      if (!this.$scope.is25g()) {
        this.$scope.selectedAccount = account;
        this.$scope.showAccounts = false;
        this.$scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'aliasTable',
        );
        this.goToAliases(account);
      }
    };

    this.$scope.isDisabled = (account) => {
      return account.state !== 'OK' ? 'disabled' : '';
    };

    this.$scope.deleteAccount = (account) => {
      if (account.state === 'OK') {
        this.$scope.setAction(
          'emailpro/account/remove/emailpro-account-remove',
          angular.copy(account),
        );
      }
    };

    this.$scope.delegationSettings = (account) => {
      if (account.state === 'OK') {
        this.$scope.setAction(
          'emailpro/account/delegation/emailpro-account-delegation',
          angular.copy(account),
        );
      }
    };

    this.$scope.aliasDisplay = (account) => {
      if (account.state === 'OK') {
        this.$scope.showAliases(account);
      }
    };

    this.$scope.addNewConfigureAccount = () => {
      this.$scope.loadingNewConfiguredAccount = true;
      const newConfiguredAccount = find(this.$scope.accountIds, (account) => {
        const [, domain] = account.split('@');
        return /.*configureme\.me$/.test(domain);
      });
      this.EmailPro.getAccount({
        exchangeService: this.$stateParams.productId,
        primaryEmailAddress: newConfiguredAccount,
      })
        .then((account) => {
          this.$scope.accountIds = this.$scope.accountIds.slice(1);
          set(account, 'completeDomain', {
            name: account.domain,
            displayName: punycode.toUnicode(account.domain),
            formattedName: punycode.toASCII(account.domain),
          });
          this.$scope.setAction(
            'emailpro/account/update/emailpro-account-update',
            account,
          );
        })
        .catch((err) =>
          this.$scope.setMessage(
            this.$translate.instant('emailpro_tab_ACCOUNTS_error_message'),
            {
              ...err,
              type: err.type || 'error',
            },
          ),
        )
        .finally(() => {
          this.$scope.loadingNewConfiguredAccount = false;
        });
    };

    this.$scope.convertBytesSize = (nb, unit, decimalWanted = 0) => {
      const res = window.filesize(
        this.WucConverterService.convertToOctet(nb, unit),
        {
          output: 'object',
          round: decimalWanted,
          base: -1,
        },
      );
      const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);
      return `${res.value} ${resUnit}`;
    };

    return this.$q
      .all({
        exchange: this.EmailPro.getSelected(),
        newAccountOptions: this.EmailPro.getNewAccountOptions(
          this.$stateParams.productId,
        ),
        accounts: this.EmailPro.getAccountIds({
          exchangeService: this.$stateParams.productId,
        }),
      })
      .then(({ exchange, newAccountOptions, accounts }) => {
        this.$scope.accountIds = accounts;
        if (!this.$scope.is25g()) {
          this.$scope.orderOutlookDisabled =
            exchange.offer === this.EmailPro.accountTypeDedicated ||
            (exchange.serverDiagnostic.version === 14 &&
              exchange.offer === this.EmailPro.accountTypeProvider) ||
            this.$scope.addAccountOptionIsNotAvailable();
        } else {
          this.$scope.orderOutlookDisabled = false;
        }

        if (newAccountOptions.availableDomains.length === 0) {
          this.$scope.noDomainFlag = true;
        } else {
          this.$scope.noDomainFlag = false;
        }

        this.$scope.accountsConfigured = filter(
          accounts,
          (account) => !/.*configureme\.me$/.test(account),
        );
      })
      .catch((err) => {
        this.$scope.setMessage(
          this.$translate.instant('emailpro_tab_ACCOUNTS_error_message'),
          err,
        );
      });
  }
}
