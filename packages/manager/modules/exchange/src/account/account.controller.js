import clone from 'lodash/clone';
import endsWith from 'lodash/endsWith';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import map from 'lodash/map';
import merge from 'lodash/merge';
import startsWith from 'lodash/startsWith';
import snakeCase from 'lodash/snakeCase';
import sumBy from 'lodash/sumBy';
import toUpper from 'lodash/toUpper';

import punycode from 'punycode';

import { DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME } from './account.constants';

export default class ExchangeAccountHomeController {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $translate,
    Exchange,
    coreConfig,
    exchangeAccount,
    exchangeAccountTypes,
    exchangeAccountOutlook,
    exchangeSelectedService,
    exchangeStates,
    messaging,
    navigation,
    officeAttach,
    OvhApiMe,
    ovhUserPref,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;

    this.Exchange = Exchange;
    this.coreConfig = coreConfig;
    this.exchangeAccount = exchangeAccount;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.exchangeAccountOutlook = exchangeAccountOutlook;
    this.exchangeSelectedService = exchangeSelectedService;
    this.exchangeStates = exchangeStates;
    this.messaging = messaging;
    this.navigation = navigation;
    this.officeAttach = officeAttach;
    this.OvhApiMe = OvhApiMe;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    this.hostname = this.Exchange.value.hostname;
    this.webUrl = this.Exchange.value.webUrl;

    this.linkToSpamTicket = `#/support/tickets?filters={"comparator":"is","field":"serviceName","reference":["${this.productId}"]}`;
    this.initialAccountRetrieval = true;
    this.atLeastOneDomainIsAssociatedToCurrentExchangeService = true;
    this.availableDomains = [];
    this.accountTypeOptions = {
      operators: ['is'],
    };

    this.gridParameters = {
      columnParameters: {
        current: {},
      },
    };

    this.buildAccountTypeColumnOptions();

    this.$scope.$on(this.Exchange.events.accountsChanged, () =>
      this.refreshList(),
    );

    return this.fetchInitialData();
  }

  getColumnParameters() {
    return this.gridParameters.columnParameters.current[this.productId];
  }

  buildAccountTypeColumnOptions() {
    this.accountTypeColumnOptions = {
      values: {
        STANDARD: this.exchangeAccountTypes.getDisplayValue(
          this.exchangeAccountTypes.TYPES.STANDARD,
        ),
      },
    };

    if (this.exchangeAccountTypes.CAN_DO.BASIC()) {
      this.accountTypeColumnOptions.values.BASIC = this.exchangeAccountTypes.getDisplayValue(
        this.exchangeAccountTypes.TYPES.BASIC,
      );
    }

    if (this.exchangeAccountTypes.CAN_DO.ENTERPRISE()) {
      this.accountTypeColumnOptions.values.ENTERPRISE = this.exchangeAccountTypes.getDisplayValue(
        this.exchangeAccountTypes.TYPES.ENTERPRISE,
      );
    }
  }

  fetchInitialData() {
    this.initialLoading = true;

    return this.fetchingGridColumnsLastSavedParameters()
      .then(() => this.fetchingCanUserSubscribeToOfficeAttach())
      .then(() => this.fetchingAccountCreationOptions())
      .then(() =>
        this.Exchange.getExchangeServer(this.organization, this.productId),
      )
      .then((exchangeServer) => {
        this.exchangeServer = exchangeServer;
        this.isMfaAvailable =
          this.coreConfig.isRegion('EU') &&
          this.exchangeSelectedService.isMfaAvailable();

        return this.updateColumnsParameters();
      })
      .finally(() => {
        this.initialLoading = false;
      });
  }

  fetchingGridColumnsLastSavedParameters() {
    return this.ovhUserPref
      .getValue(DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME)
      .then((gridColumnsLastSavedParameters) => {
        const savedParametersForCurrentService =
          gridColumnsLastSavedParameters[this.productId];

        if (savedParametersForCurrentService) {
          this.gridParameters.columnParameters.current[
            this.productId
          ] = savedParametersForCurrentService;
          this.computeDatagridColumnParameters(
            savedParametersForCurrentService,
          );
          this.gridColumnParametersAlreadyExist = true;
        }
      })
      .catch(() => null); // not a big deal;
  }

  fetchingCanUserSubscribeToOfficeAttach() {
    return this.OvhApiMe.v6()
      .get()
      .$promise.then(({ ovhSubsidiary }) => {
        if (['CA'].includes(ovhSubsidiary)) {
          return this.$q.when(true);
        }

        return this.officeAttach.retrievingIfUserAlreadyHasSubscribed(
          this.productId,
        );
      })
      .then((officeAttachIsNotAvailable) => {
        this.userCanSubscribeToOfficeAttach = !officeAttachIsNotAvailable;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_accounts_fetchOfficeAttachError_error',
          ),
          error,
        );
      });
  }

  fetchingAccountCreationOptions() {
    return this.Exchange.fetchingAccountCreationOptions(
      this.organization,
      this.productId,
    )
      .then((accountCreationOptions) => {
        this.availableDomains = accountCreationOptions.availableDomains;
        this.atLeastOneDomainIsAssociatedToCurrentExchangeService = !isEmpty(
          get(accountCreationOptions, 'availableDomains'),
        );
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_accounts_fetchAccountCreationOptions_error',
          ),
          error,
        );
      });
  }

  fetchAccounts(parameters) {
    this.gridParameters = merge(this.gridParameters, parameters);

    this.gridParameters.searchValues = map(
      filter(
        parameters.criteria,
        (criterium) =>
          isNull(criterium.property) || criterium.property === 'emailAddress',
      ),
      (criterium) => criterium.value,
    );

    const accountTypeFilters = map(
      filter(
        parameters.criteria,
        (criterium) => criterium.property === 'accountLicense',
      ),
      (criterium) => criterium.value,
    );

    this.gridParameters.accountTypeFilter =
      accountTypeFilters.length === 2 ? '' : accountTypeFilters[0];

    return this.Exchange.fetchAccounts(
      this.organization,
      this.productId,
      parameters.pageSize,
      parameters.offset - 1,
      this.gridParameters.searchValues,
      this.gridParameters.accountTypeFilter,
    )
      .then((accounts) => {
        this.accounts = this.formatAccountsForDatagrid(
          accounts,
          parameters.sort,
          parameters.criteria,
        );

        this.datagridData = {
          data: this.accounts,
          meta: {
            totalCount: accounts.count,
          },
        };

        if (this.gridColumnParametersAlreadyExist) {
          return null;
        }

        return this.updateColumnsParameters();
      })
      .then(() => this.datagridData)
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_accounts_fetchAccounts_error'),
          error,
        );
      })
      .finally(() => {
        this.initialAccountRetrieval = false;
      });
  }

  refreshList() {
    return this.Exchange.fetchAccounts(
      this.organization,
      this.productId,
      this.gridParameters.pageSize,
      this.gridParameters.offset - 1,
      this.gridParameters.searchValues,
      this.gridParameters.accountTypeFilter,
    )
      .then((accounts) => {
        const formattedAccounts = this.formatAccountsForDatagrid(
          accounts,
          this.gridParameters.sort,
          this.gridParameters.criteria,
        );

        for (let i = 0; i < formattedAccounts.length; i += 1) {
          this.accounts.splice(i, 1, formattedAccounts[i]);
        }

        for (
          let i = formattedAccounts.length;
          i < this.accounts.length;
          i += 1
        ) {
          this.accounts.splice(i, 1);
        }

        if (this.gridColumnParametersAlreadyExist) {
          return null;
        }

        return this.updateColumnsParameters();
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_accounts_fetchAccounts_error'),
          error,
        );
      });
  }

  formatAccountsForDatagrid(accounts, sortingOptions, criteria) {
    function unpunycodeEmailAddress(emailAddress) {
      const parts = emailAddress.split('@');
      const unpunycodedLocalPart = punycode.toUnicode(parts[0]);

      return `${unpunycodedLocalPart}@${parts[1]}`;
    }

    function transformSizeData(account) {
      return {
        usage: Math.round(
          // eslint-disable-next-line no-restricted-properties
          ((account.currentUsage / Math.pow(1024, 2)) * 100) / account.quota,
        ),
        progressionText: `${account.usedQuota.value} ${this.$translate.instant(
          `unit_size_${account.usedQuota.unit}`,
        )} / ${account.totalQuota.value} ${this.$translate.instant(
          `unit_size_${account.totalQuota.unit}`,
        )}`,
      };
    }

    function transformOutlookStatus(account) {
      const accountOutlookStatus = this.exchangeAccountOutlook.getStatus(
        account,
      );

      if (
        !this.exchangeAccountOutlook.canHaveLicense(account) ||
        this.exchangeAccountOutlook.hasStatus(
          account,
          this.exchangeAccountOutlook.STATES.CANT_ORDER_OR_ACTIVATE_LICENSE,
        )
      ) {
        return {
          state: '',
          displayValue: '',
        };
      }

      return {
        // eslint-disable-next-line no-restricted-globals
        status,
        displayValue: this.$translate.instant(
          `exchange_tab_accounts_table_outlook_${accountOutlookStatus}`,
        ),
      };
    }

    function chooseStatusText(account) {
      if (this.exchangeStates.constructor.isDeleting(account)) {
        return this.exchangeAccount.CAN_DO.DESTRUCTION_METHOD.DELETING()
          ? this.$translate.instant('exchange_tab_ACCOUNTS_state_DELETING')
          : this.$translate.instant('exchange_tab_ACCOUNTS_state_RESETTING');
      }

      if (account.spamDetected) {
        return this.$translate.instant('exchange_tab_ACCOUNTS_state_BLOCKED');
      }

      if (this.exchangeAccount.isPlaceholder(account)) {
        return this.$translate.instant(
          'exchange_tab_ACCOUNTS_state_TO_CONFIGURE',
        );
      }

      if (this.exchangeStates.isValidState(account.state)) {
        return this.$translate.instant(
          `exchange_tab_ACCOUNTS_state_${toUpper(snakeCase(account.state))}`,
        );
      }

      if (isNumber(account.taskPendingId) && account.taskPendingId !== 0) {
        return this.$translate.instant(
          'exchange_tab_ACCOUNTS_state_TASK_ON_DOING',
        );
      }

      return this.$translate.instant('exchange_tab_ACCOUNTS_state_UNKNOWN');
    }

    function filterCompany(account) {
      const companyValue = account.company || '';

      return every(filter(criteria, { property: 'company' }), (criterium) => {
        const companyValueUpperCase = `${companyValue}`.trim().upperCase();
        const criteriumValueUpperCase = `${criterium.value}`.trim().upperCase();

        switch (criterium.operator) {
          case 'contains':
            return companyValueUpperCase.includes(criteriumValueUpperCase);
          case 'containsNot':
            return !companyValueUpperCase.includes(criteriumValueUpperCase);
          case 'startsWith':
            return startsWith(companyValueUpperCase, criteriumValueUpperCase);
          case 'endsWith':
            return endsWith(companyValueUpperCase, criteriumValueUpperCase);
          case 'is':
            return companyValue === criterium.value;
          case 'isNot':
            return companyValue !== criterium.value;
          default:
            return true;
        }
      });
    }

    let formattedAccounts = get(accounts, 'list.results', []).map(
      (account) => ({
        ...account,
        emailAddress: unpunycodeEmailAddress(account.primaryEmailDisplayName),
        size: transformSizeData.call(this, account),
        numberOfAliases: account.aliases,
        outlookStatus: transformOutlookStatus.call(this, account),
        status: chooseStatusText.call(this, account),
      }),
    );

    if (!isEmpty(filter(criteria, { property: 'company' }))) {
      formattedAccounts = formattedAccounts.filter(filterCompany);
    }

    formattedAccounts = this.$filter('orderBy')(
      formattedAccounts,
      sortingOptions.property,
      sortingOptions.dir < 0,
    );

    return formattedAccounts;
  }

  displayAliasManagementView(account) {
    this.messaging.resetMessages();
    this.goToAliasManagement(account);
  }

  displayDialog(pathToFeature, account) {
    const accountCopy = clone(account);
    if (pathToFeature.includes('account-delegation')) {
      accountCopy.availableDomains = this.availableDomains;
    }
    this.navigation.setAction(pathToFeature, accountCopy);
  }

  displayAccountAddingView() {
    this.messaging.resetMessages();
    this.goToAddAccount();
  }

  openAccountOrderingDialog() {
    const placeholderAccountAmount = sumBy(this.accounts, (account) =>
      this.exchangeAccount.isPlaceholder(account),
    );
    this.navigation.setAction('exchange/account/order/account-order', {
      placeholderAccountAmount,
    });
  }

  updateColumnsParameters() {
    const newColumnParameters = this.computeDefaultColumnParameters();
    const changesHaveBeenDone = this.computeDatagridColumnParameters(
      newColumnParameters,
    );

    return changesHaveBeenDone ? this.savingDatagridColumnParameters() : null;
  }

  computeDefaultColumnParameters() {
    return [
      {
        name: 'company',
        hidden: !this.accounts.some((account) => !isEmpty(account.company)),
      },
      {
        name: 'mfa',
        hidden: !this.isMfaAvailable,
      },
    ];
  }

  computeDatagridColumnParameters(newParameters) {
    const newParametersAsArray = isArray(newParameters)
      ? newParameters
      : [newParameters];

    if (isEmpty(newParametersAsArray)) {
      throw new Error(
        'computeDatagridColumnParameters: at least one parameter to update is required',
      );
    }

    let atLeastOneChangeExists = false;

    this.gridParameters.columnParameters.current[
      this.productId
    ] = newParametersAsArray.map((currentNewParameter) => {
      const oldParameterMatchingCurrentNewParameter = find(
        this.gridParameters.columnParameters.current[this.productId],
        { name: currentNewParameter.name },
      );

      if (!oldParameterMatchingCurrentNewParameter) {
        atLeastOneChangeExists = true;
        return currentNewParameter;
      }

      const changeExistsBetweenParameters = !isEqual(
        oldParameterMatchingCurrentNewParameter,
        currentNewParameter,
      );

      if (changeExistsBetweenParameters) {
        atLeastOneChangeExists = true;
      }

      return changeExistsBetweenParameters
        ? merge(oldParameterMatchingCurrentNewParameter, currentNewParameter)
        : currentNewParameter;
    });

    return atLeastOneChangeExists;
  }

  onColumnsParametersChange(id, newParameters) {
    function fixHiddenProperty(parameter) {
      return parameter.hidden == null
        ? {
            ...parameter,
            hidden: false,
          }
        : parameter;
    }

    const parametersWithHidden = newParameters.map(fixHiddenProperty);

    this.computeDatagridColumnParameters(parametersWithHidden);

    return this.savingDatagridColumnParameters();
  }

  savingDatagridColumnParameters() {
    return this.ovhUserPref
      .assign(
        DATAGRID_COLUMN_PARAMETERS_PREFERENCE_NAME,
        this.gridParameters.columnParameters.current,
      )
      .catch(() => {});
  }

  openAllAccountsMFACreateDialog() {
    this.navigation.setAction('exchange/account/mfa/bulk-create');
  }

  openAllAccountsMFADeleteDialog() {
    this.navigation.setAction('exchange/account/mfa/bulk-delete');
  }
}
