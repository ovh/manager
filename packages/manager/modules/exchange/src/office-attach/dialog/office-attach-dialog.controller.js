import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

export default class OfficeAttachDialogCtrl {
  /* @ngInject */
  constructor(
    Exchange,
    exchangeVersion,
    messaging,
    navigation,
    ovhUserPref,
    $scope,
    $translate,
    User,
    $window,
  ) {
    this.Exchange = Exchange;
    this.exchangeVersion = exchangeVersion;
    this.messaging = messaging;
    this.navigation = navigation;
    this.ovhUserPref = ovhUserPref;
    this.$scope = $scope;
    this.$translate = $translate;
    this.User = User;
    this.$window = $window;
  }

  $onInit() {
    this.loading = {
      step1: {
        general: false,
        table: false,
      },
      step2: {
        general: false,
      },
    };

    this.debouncedSetFilter = debounce(this.setFilter, 300);
    this.numberOfSelectedCheckboxes = 0;
    this.maxNumberOfAccounts = 25;
    this.selectedCheckboxes = {};
    this.selectedAccounts = [];
    this.exchange = this.Exchange.value;

    this.searchValue = null;
    this.isStep1Valid = false;

    this.accountTypes = ['ALL', 'BASIC', 'STANDARD', 'ENTERPRISE'];
    this.filterType = 'ALL';
    this.tr = this.$scope.tr;

    this.$scope.onWizardCancel = () => this.onWizardCancel();
    this.$scope.onWizardFinish = () => this.onWizardFinish();
    this.$scope.onWizardLoad = () => this.onWizardLoad();
    this.$scope.loadSelectedAccounts = () => this.loadSelectedAccounts();

    this.$scope.loading = this.loading;
    this.$scope.retrieveAccounts = (count, offset) =>
      this.retrieveAccounts(count, offset);
    this.$scope.isStep1Valid = this.isStep1Valid;
    this.$scope.isStep2Valid = () => this.isStep2Valid();

    return this.User.getUser().then((user) => {
      this.ovhSubsidiary = user.ovhSubsidiary;
    });
  }

  onWizardCancel() {
    this.navigation.resetAction();
  }

  resetSearch() {
    this.searchValue = null;
    this.setFilter();
  }

  onWizardFinish() {
    this.navigation.resetAction();

    let displayName = `${this.exchange.displayName} Office`;
    if (
      this.exchange.displayName.match(/.*hosted.*/i) ||
      this.exchange.displayName.match(/.*exchange.*/i) ||
      this.exchange.displayName.match(/.*private.*/i)
    ) {
      displayName = this.exchange.displayName
        .replace(/hosted/i, 'Office')
        .replace(/exchange/i, 'Office')
        .replace(/private/i, 'Office');
    }

    const alreadyKnownAccounts = [];
    const accountsToSave = [];

    forEach(this.selectedAccounts, (alreadyKnownAccount) => {
      if (
        !alreadyKnownAccounts.includes(
          alreadyKnownAccount.primaryEmailDisplayName,
        )
      ) {
        alreadyKnownAccounts.push(alreadyKnownAccount.primaryEmailDisplayName);
        accountsToSave.push(alreadyKnownAccount);
      }
    });

    this.selectedAccounts = accountsToSave;

    const answer = [
      {
        planCode: 'office-tenant',
        configuration: [
          {
            label: 'zip_code',
            values: ['00000'],
          },
          {
            label: 'display_name',
            values: [displayName],
          },
          {
            label: 'exchange_service_name',
            values: [this.exchange.domain],
          },
          {
            label: 'country',
            values: [this.ovhSubsidiary || 'FR'],
          },
        ],
        option: [],
        quantity: 1,
        productId: 'office365Prepaid',
      },
    ];

    answer[0].option = map(this.selectedAccounts, (account) => ({
      planCode: 'office-business-pp',
      configuration: [
        {
          label: 'lastName',
          values: [account.lastName ? account.lastName : ''],
        },
        {
          label: 'firstName',
          values: [account.firstName ? account.firstName : ''],
        },
        {
          label: 'login',
          values: [account.primaryEmailDisplayName.split(/@/)[0]],
        },
      ],
      option: [],
      quantity: 1,
    }));

    this.User.getUrlOfEndsWithSubsidiary('express_order').then(
      (expressOrderUrl) => {
        this.$window.open(
          `${expressOrderUrl}#/new/express/resume?products=${JSURL.stringify(
            answer,
          )}`,
          '_blank',
        );
      },
    );
  }

  onSearchValueChange() {
    this.debouncedSetFilter();
  }

  setFilter() {
    this.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'officeAttachTable',
    );
  }

  step1IsValid() {
    this.$scope.isStep1Valid =
      this.numberOfSelectedCheckboxes <= this.maxNumberOfAccounts &&
      this.numberOfSelectedCheckboxes > 0;
  }

  onWizardLoad() {
    return this.Exchange.getAccounts(
      this.exchange,
      this.maxNumberOfAccounts,
      0,
      this.searchValue,
      false,
      null,
    )
      .then((accounts) => {
        let i = 0;

        forEach(accounts.list.results, (account) => {
          const id = account.primaryEmailDisplayName;

          if (isEmpty(this.selectedCheckboxes[id])) {
            if (i < this.maxNumberOfAccounts) {
              this.selectedCheckboxes[id] = true;
              this.selectedAccounts.push(account);
            } else {
              this.selectedCheckboxes[id] = false;
            }
          }

          i += 1;
        });
      })
      .finally(() => {
        this.countNumberOfCheckedAccounts();
      });
  }

  retrieveAccounts(count, offset) {
    this.messaging.resetMessages();
    this.offset = offset;
    this.loading.step1.table = true;
    const filterType = this.filterType === 'ALL' ? null : this.filterType;

    this.updateAccounts(null);

    return this.Exchange.getAccounts(
      this.exchange,
      count,
      offset,
      this.searchValue,
      false,
      filterType,
    )
      .then((accounts) => {
        this.updateAccounts(accounts);
      })
      .catch((failure) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_tab_ACCOUNTS_error_message'),
          failure,
        );
      })
      .finally(() => {
        this.loading.step1.table = false;
        this.countNumberOfCheckedAccounts();
      });
  }

  updateAccounts(accounts) {
    this.accounts = accounts;

    if (!isEmpty(accounts)) {
      const alreadyPresentAccounts = this.selectedAccounts.map(
        (account) => account.primaryEmailDisplayName,
      );
      this.selectedAccounts = this.selectedAccounts.concat(
        accounts.list.results.filter(
          (account) =>
            !alreadyPresentAccounts.includes(account.primaryEmailDisplayName),
        ),
      );
    }

    this.$scope.accounts = accounts;
  }

  countNumberOfCheckedAccounts() {
    if (!isEmpty(this.accounts)) {
      const currentDisplayedAccountEmailAddresses = this.accounts.list.results.map(
        (account) => account.primaryEmailDisplayName,
      );
      const selectedAccountsCurrentBeingDisplayed = this.selectedAccounts.filter(
        (currentSelectedAccount) =>
          currentDisplayedAccountEmailAddresses.includes(
            currentSelectedAccount.primaryEmailDisplayName,
          ),
      );

      const currentlySelectedAccountsEmailAddresses = Object.keys(
        this.selectedCheckboxes,
      ).filter((key) => this.selectedCheckboxes[key]);
      const currentlyDislayedAccountsThatAreSelected = this.accounts.list.results.filter(
        (account) =>
          currentlySelectedAccountsEmailAddresses.includes(
            account.primaryEmailDisplayName,
          ),
      );

      const alreadyPresentAccounts = currentlyDislayedAccountsThatAreSelected.map(
        (account) => account.primaryEmailDisplayName,
      );
      this.selectedAccounts = currentlyDislayedAccountsThatAreSelected.concat(
        selectedAccountsCurrentBeingDisplayed.filter(
          (account) =>
            !alreadyPresentAccounts.includes(account.primaryEmailDisplayName),
        ),
      );

      const currentlyNotSelectedAccountsEmailAddresses = Object.keys(
        this.selectedCheckboxes,
      ).filter((key) => !this.selectedCheckboxes[key]);

      this.selectedAccounts = this.selectedAccounts.filter(
        (account) =>
          !currentlyNotSelectedAccountsEmailAddresses.includes(
            account.primaryEmailDisplayName,
          ),
      );

      this.numberOfSelectedCheckboxes =
        currentlySelectedAccountsEmailAddresses.length;
      this.step1IsValid();
    }
  }

  loadSelectedAccounts() {
    const keys = Object.keys(this.selectedCheckboxes);
    const accounts = filter(keys, (key) => this.selectedCheckboxes[key]);

    return accounts;
  }

  isStep2Valid() {
    return this.confirmationCheckbox;
  }
}
