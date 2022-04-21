import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import 'moment';

export default class ExchangeExportToCsvAccountsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $translate,
    wucExchange,
    ExchangeAccountService,
    ExchangeExternalContacts,
    ExchangeSharedAccounts,
    messaging,
    navigation,
    exportCsv,
  ) {
    this.services = {
      $scope,
      $q,
      $translate,
      wucExchange,
      ExchangeAccountService,
      ExchangeExternalContacts,
      ExchangeSharedAccounts,
      messaging,
      navigation,
    };

    this.headers = {
      external: [
        'externalEmailAddress',
        'firstName',
        'lastName',
        'displayName',
        'creationDate',
        'hiddenFromGAL',
      ],
      group: [
        'displayName',
        'mailingListAddress',
        'mailingListDisplayName',
        'mailingListName',
        'aliases',
        'members',
        'managers',
      ],
      shared: [
        'primaryEmailAddress',
        'quota',
        'firstName',
        'lastName',
        'displayName',
        'hiddenFromGAL',
      ],
    };

    this.$routerParams = wucExchange.getParams();
    this.timeoutObject = null;
    this.loading = {
      exportCsv: false,
    };
    this.filterType = navigation.currentActionData.filterType;
    this.search = navigation.currentActionData.search;
    this.totalAccounts = navigation.currentActionData.total;
    this.csvExportType = navigation.currentActionData.csvExportType;
    this.exchange = wucExchange.value;
    this.exportCsv = exportCsv;

    $scope.exportAccounts = () => this.exportAccounts();
    $scope.cancelExport = () => this.cancelExport();
  }

  exportAccounts() {
    const exportOpts = {
      count: 1000,
      total: this.totalAccounts,
      search: this.search,
      filter: this.filterType === 'ALL' ? null : this.filterType,
      rejectAttrs: [
        '$$hashKey',
        'currentUsage',
        'completeDomain',
        'mailingFilterList',
        'canBeConfigured',
        'initial',
        'samaccountName',
        'taskPendingId',
        'id',
        // Removing the description field as it breaks the CSV file in MS Excel
        // https://answers.microsoft.com/en-us/msoffice/forum/all/excel-read-csv-set-utf-8-as-default-for-all-csv/62eb4068-fc70-4f9b-9bd7-c904713beaf0
        'description',
      ],
      toConcatAttrs: ['totalQuota', 'usedQuota', 'quota'],
      toJointAttrs: ['aliases', 'managers', 'members'],
    };

    this.loading.exportCsv = true;

    // check timeout
    if (this.timeoutObject != null) {
      this.timeoutObject.resolve();
    }

    // init timeout
    this.timeoutObject = this.services.$q.defer();

    // get data for csv
    this.prepareForCsv(
      exportOpts,
      0,
      {
        headers: [],
        accounts: [],
      },
      this.timeoutObject.promise,
    )
      .then((datas) => {
        if (datas != null && !isEmpty(datas) && this.timeoutObject != null) {
          // get column name
          const separator = ',';
          const { headers } = datas;
          const csvContent = [
            headers.join(separator),
            ...datas.accounts.map((account) =>
              this.services.ExchangeAccountService.accountToCSVString(
                account,
                headers,
                separator,
              ),
            ),
          ].join('\n');

          this.exportCsv.exportData({
            datas: csvContent,
            fileName: `export_${this.csvExportType}_${
              this.exchange.displayName
            }_${moment().format('YYYY-MM-DD_HH:mm:ss')}.csv`,
            separator,
          });

          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_ACTION_export_success'),
          );
        } else if (datas != null || isEmpty(datas)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_export_error'),
          );
        }

        this.timeoutObject = null;
        this.loading.exportCsv = false;
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  cancelExport() {
    this.timeoutObject = null;
    this.services.navigation.resetAction();
  }

  prepareForCsv(exportOpts, offset, infos, timeoutObject) {
    let promise = null;
    switch (this.csvExportType) {
      case 'accounts':
        promise = this.services.wucExchange.prepareForCsv(
          this.exchange,
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'group':
        promise = this.services.wucExchange.prepareGroupsForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'external':
        promise = this.services.ExchangeExternalContacts.prepareForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      case 'shared':
        promise = this.services.ExchangeSharedAccounts.prepareForCsv(
          this.$routerParams.organization,
          this.$routerParams.productId,
          exportOpts,
          offset,
          timeoutObject,
        );
        break;
      default:
        break;
    }

    return promise.then((datas) => {
      if (datas != null) {
        set(infos, 'accounts', infos.accounts.concat(datas.accounts));
        set(
          infos,
          'headers',
          isEmpty(infos.headers) ? datas.headers : infos.headers,
        );

        if (['group', 'external', 'shared'].includes(this.csvExportType)) {
          set(infos, 'headers', this.headers[this.csvExportType]);
        } else {
          set(
            infos,
            'headers',
            difference(datas.headers, exportOpts.rejectAttrs),
          );
        }

        if (offset + exportOpts.count < exportOpts.total) {
          return this.prepareForCsv(
            exportOpts,
            offset + exportOpts.count,
            infos,
            timeoutObject,
          );
        }
        return infos;
      }

      return null;
    });
  }
}
