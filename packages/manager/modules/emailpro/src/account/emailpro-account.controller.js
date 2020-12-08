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
} from './emailpro-constants';

export default /* @ngInject */ (
  $scope,
  EmailPro,
  $q,
  $stateParams,
  $translate,
  WucConverterService,
) => {
  $scope.stateCreating = EmailPro.stateCreating;
  $scope.stateDeleting = EmailPro.stateDeleting;
  $scope.stateOk = EmailPro.stateOk;
  $scope.stateReopening = EmailPro.stateReopening;
  $scope.stateSuspended = EmailPro.stateSuspended;
  $scope.stateSuspending = EmailPro.stateSuspending;
  $scope.stateTaskError = STATE_TASK_ERROR;
  $scope.stateTaskDoing = STATE_TASK_DOING;
  $scope.SIZE_UNIT = SIZE_UNIT;

  $scope.exchangeTypeHosted = EmailPro.accountTypeHosted;
  $scope.exchangeTypeDedicated = EmailPro.accountTypeDedicated;
  $scope.exchangeTypeProvider = EmailPro.accountTypeProvider;

  $scope.accountTypes = ACCOUNT_TYPES;
  $scope.filterType = FILTER_TYPE;

  $scope.setFilter = function setFilter() {
    $scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
  };

  const init = function init() {
    $scope.loading = false;
    $scope.accounts = null;
    $scope.loadingNewConfiguredAccount = false;
    $scope.displayAccounts();

    $scope.showAccounts = true;
    $scope.showAlias = false;
    $scope.selectedAccount = null;
    $scope.noDomainFlag = true;
    $scope.newConfiguredAccount = [];

    return $q
      .all({
        exchange: EmailPro.getSelected(),
        newAccountOptions: EmailPro.getNewAccountOptions(
          $stateParams.productId,
        ),
        accounts: EmailPro.getAccountIds({
          exchangeService: $stateParams.productId,
        }),
      })
      .then(({ exchange, newAccountOptions, accounts }) => {
        $scope.accountIds = accounts;
        if (!$scope.is25g()) {
          $scope.orderOutlookDisabled =
            exchange.offer === EmailPro.accountTypeDedicated ||
            (exchange.serverDiagnostic.version === 14 &&
              exchange.offer === EmailPro.accountTypeProvider) ||
            $scope.addAccountOptionIsNotAvailable();
        } else {
          $scope.orderOutlookDisabled = false;
        }

        if (newAccountOptions.availableDomains.length === 0) {
          $scope.noDomainFlag = true;
        } else {
          $scope.noDomainFlag = false;
        }

        $scope.accountsConfigured = filter(
          accounts,
          (account) => !/.*configureme\.me$/.test(account),
        );
      })
      .catch((err) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ACCOUNTS_error_message'),
          err,
        );
      });
  };

  $scope.spamTooltipContent = $translate.instant(
    'emailpro_tab_ACCOUNTS_popover_span_text',
    {
      t0: `#/support/tickets?filters={"comparator":"is","field":"serviceName","reference":["${$stateParams.productId}"]}`,
    },
  );

  $scope.$watch('search.value', (search) => {
    if ($scope.search) {
      if ($scope.search.value === search) {
        $scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
      }
    }
  });

  $scope.getAccounts = function getAccounts(count, offset) {
    $scope.setMessage(null);
    $scope.loading = true;

    EmailPro.getAccounts(
      count,
      offset,
      $scope.search.value,
      $scope.exchange.isMXPlan ? 1 : 0,
      $scope.filterType === 'ALL' ? null : $scope.filterType,
    ).then(
      (accounts) => {
        $scope.loading = false;
        $scope.accounts = accounts;

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
        $scope.loading = false;
        $scope.setMessage(
          $translate.instant('emailpro_tab_ACCOUNTS_error_message'),
          failure,
        );
      },
    );
  };

  $scope.$on(EmailPro.events.accountsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'accountsTable');
  });

  $scope.$on('showAccounts', () => {
    $scope.displayAccounts();
  });

  $scope.addAccountOptionIsNotAvailable = function addAccountOptionIsNotAvailable() {
    return (
      $scope.exchange.nicType.indexOf(EmailPro.nicAdmin) === -1 &&
      $scope.exchange.nicType.indexOf(EmailPro.nicTech) === -1
    );
  };

  $scope.newAccount = function newAccount() {
    if ($scope.is25g()) {
      $scope.setAction('emailpro/account/order/email-pro-account-order');
    } else if ($scope.exchange.offer === $scope.exchangeTypeDedicated) {
      $scope.setAction('emailpro/account/add/emailpro-account-add');
    } else if (
      $scope.exchange.offer === $scope.exchangeTypeProvider &&
      $scope.exchange.serverDiagnostic.version === EmailPro.EmailPro2010Code
    ) {
      $scope.setAction('emailpro/account/add/emailpro-account-add');
    } else {
      $scope.setAction('emailpro/account/order/emailpro-account-order');
    }
  };

  $scope.isEditable = function isEditable(account) {
    return (
      (account.state === $scope.stateOk ||
        account.state === $scope.stateTaskDoing ||
        account.state === $scope.stateTaskError) &&
      !$scope.noDomainFlag
    );
  };

  $scope.isConfigurable = function isConfigurable(account) {
    return account.canBeConfigured;
  };

  $scope.editAccount = function editAccount(account) {
    const populateAccount = angular.copy(account);

    populateAccount.is25g = $scope.is25g();

    if ($scope.isEditable(account)) {
      $scope.setAction(
        'emailpro/account/update/emailpro-account-update',
        populateAccount,
      );
    }
  };

  $scope.showAliases = function showAliases(account) {
    if (!$scope.is25g()) {
      $scope.selectedAccount = account;
      $scope.showAccounts = false;
      $scope.showAlias = true;
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'aliasTable');
    }
  };

  $scope.displayAccounts = function displayAccounts() {
    $scope.search = { value: null };
    $scope.showAccounts = true;
    $scope.showAlias = false;
    $scope.selectedAccount = null;
  };

  $scope.isDisabled = function isDisabled(account) {
    return account.state !== 'OK' ? 'disabled' : '';
  };

  $scope.deleteAccount = function deleteAccount(account) {
    if (account.state === 'OK') {
      $scope.setAction(
        'emailpro/account/remove/emailpro-account-remove',
        angular.copy(account),
      );
    }
  };

  $scope.delegationSettings = function delegationSettings(account) {
    if (account.state === 'OK') {
      $scope.setAction(
        'emailpro/account/delegation/emailpro-account-delegation',
        angular.copy(account),
      );
    }
  };

  $scope.aliasDisplay = function aliasDisplay(account) {
    if (account.state === 'OK') {
      $scope.showAliases(account);
    }
  };

  $scope.addNewConfigureAccount = function addNewConfigureAccount() {
    $scope.loadingNewConfiguredAccount = true;
    const newConfiguredAccount = find($scope.accountIds, (account) => {
      const [, domain] = account.split('@');
      return /.*configureme\.me$/.test(domain);
    });
    EmailPro.getAccount({
      exchangeService: $stateParams.productId,
      primaryEmailAddress: newConfiguredAccount,
    })
      .then((account) => {
        $scope.accountIds = $scope.accountIds.slice(1);
        set(account, 'completeDomain', {
          name: account.domain,
          displayName: punycode.toUnicode(account.domain),
          formattedName: punycode.toASCII(account.domain),
        });
        $scope.setAction(
          'emailpro/account/update/emailpro-account-update',
          account,
        );
      })
      .catch((err) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_ACCOUNTS_error_message'),
          {
            ...err,
            type: err.type || 'error',
          },
        );
      })
      .finally(() => {
        $scope.loadingNewConfiguredAccount = false;
      });
  };

  $scope.convertBytesSize = function convertBytesSize(
    nb,
    unit,
    decimalWanted = 0,
  ) {
    const res = window.filesize(WucConverterService.convertToOctet(nb, unit), {
      output: 'object',
      round: decimalWanted,
      base: -1,
    });
    const resUnit = $translate.instant(`unit_size_${res.symbol}`);
    return `${res.value} ${resUnit}`;
  };
  init();
};
