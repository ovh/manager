import chunk from 'lodash/chunk';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';
import values from 'lodash/values';
import size from 'lodash/size';

export default /* @ngInject */ function TelecomTelephonyBillingAccountAdministrationLinesGroup(
  $scope,
  $stateParams,
  $q,
  $translate,
  TelephonyMediator,
  TelephonySidebar,
  OvhApiTelephony,
  TucToast,
  TucToastError,
  iceberg,
) {
  const self = this;

  this.$onInit = function $onInit() {
    self.billingAccounts = {
      accounts: [],
      paginated: null,
      current: $stateParams.billingAccount,
      selected: null,
    };

    self.services = null;
    self.servicesToAttach = {};
    self.serviceAttachSuccess = {};
    self.serviceAttachErrors = {};

    const getNumberCount = OvhApiTelephony.Number()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then(size);

    const getLineCount = OvhApiTelephony.Line()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then(size);

    return $q
      .all({
        billingAccounts: iceberg('/telephony')
          .query()
          .expand('CachedObjectList-Pages')
          .execute().$promise,
        numberCount: getNumberCount,
        lineCount: getLineCount,
      })
      .then(
        (result) => {
          self.billingAccounts.accounts = result.billingAccounts.data.filter(
            (account) =>
              account.billingAccount !== self.billingAccounts.current,
          );
          self.numberCount = result.numberCount;
          self.lineCount = result.lineCount;
        },
        (err) => new TucToastError(err),
      );
  };

  self.selectBillingAccount = function selectBillingAccount(ba) {
    if (
      ba &&
      ba.billingAccount !== self.billingAccounts.current &&
      ba.status === 'enabled'
    ) {
      self.billingAccounts.selected = ba;
      self.fetchBillingAccountServices(ba);
    }
  };

  self.cancelBillingAccountSelection = function cancelBillingAccountSelection() {
    self.billingAccounts.selected = null;
    self.servicesToAttach = {};
  };

  self.fetchBillingAccountServices = function fetchBillingAccountServices(ba) {
    self.services = null;

    // get batch line details
    const lines = OvhApiTelephony.Line()
      .v6()
      .query({
        billingAccount: ba.billingAccount,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.Line()
                  .v6()
                  .getBatch({
                    billingAccount: ba.billingAccount,
                    serviceName: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );

    // get batch alias details
    const aliases = OvhApiTelephony.Number()
      .v6()
      .query({
        billingAccount: ba.billingAccount,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.Number()
                  .v6()
                  .getBatch({
                    billingAccount: ba.billingAccount,
                    serviceName: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );

    // get batch voicefax details
    const voicefax = OvhApiTelephony.Fax()
      .v6()
      .query({
        billingAccount: ba.billingAccount,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.Fax()
                  .v6()
                  .getBatch({
                    billingAccount: ba.billingAccount,
                    serviceName: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) =>
            map(flatten(chunkResult), 'value').filter(
              (res) =>
                res.serviceType.includes('line') &&
                res.offers.toString().includes('voicefax'),
            ),
          ),
      );

    return $q
      .all({
        lines,
        aliases,
        voicefax,
      })
      .then((result) => {
        // push voicefax lines to lines
        result.lines.push(result.voicefax);
        set(result, 'lines', compact(flatten(result.lines)));

        // handle pool of aliases
        const pools = [];
        set(
          result,
          'aliases',
          filter(result.aliases, (alias) => {
            if (alias.partOfPool) {
              let pool = find(pools, { id: alias.partOfPool });
              if (!pool) {
                pool = {
                  id: alias.partOfPool,
                  serviceName: alias.serviceName,
                  aliases: [],
                };
                pools.push(pool);
              }
              pool.aliases.push(alias);
              return false;
            }
            return true;
          }),
        );
        self.services = result;
        self.services.pools = pools;
      });
  };

  self.getServicesToAttachList = function getServicesToAttachList() {
    return values(filter(self.servicesToAttach, (val) => !!val));
  };

  self.attachSelectedServices = function attachSelectedServices() {
    const errorList = [];
    self.isAttaching = true;

    return $q
      .all(
        map(self.getServicesToAttachList(), (service) =>
          OvhApiTelephony.Service()
            .v6()
            .changeOfBillingAccount(
              {
                billingAccount: self.billingAccounts.selected.billingAccount,
                serviceName: service.serviceName,
              },
              {
                billingAccountDestination: $stateParams.billingAccount,
              },
            )
            .$promise.then(() => {
              if (service.aliases) {
                self.numberCount += service.aliases.length;
              } else if (service.serviceType === 'line') {
                self.lineCount += 1;
              } else {
                self.numberCount += 1;
              }
              self.serviceAttachSuccess[service.serviceName] = true;
              delete self.serviceAttachErrors[service.serviceName];
            })
            .catch((err) => {
              errorList.push({
                service,
                error: err,
              });
              self.serviceAttachErrors[service.serviceName] = err;
            }),
        ),
      )
      .finally(() => {
        self.isAttaching = false;
        self.servicesToAttach = {};
        if (errorList.length === 0) {
          TucToast.success(
            $translate.instant('telephony_lines_group_attach_success'),
          );
        } else {
          TucToast.error(
            $translate.instant('telephony_lines_group_attach_warning'),
          );
        }

        // update sidebar with fresh data
        TelephonyMediator.resetAllCache();
        TelephonySidebar.reset();
      });
  };
}
