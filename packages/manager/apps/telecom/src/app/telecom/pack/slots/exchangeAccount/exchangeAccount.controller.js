export default class PackExchangeAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $http,
    $q,
    $stateParams,
    coreURLBuilder,
    OvhApiPackXdslExchangeAccount,
    iceberg,
  ) {
    this.$scope = $scope;
    this.$http = $http;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.coreURLBuilder = coreURLBuilder;
    this.OvhApiPackXdslExchangeAccount = OvhApiPackXdslExchangeAccount;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.$scope.loaders = {
      services: true,
    };
    return this.getExchangeAccounts()
      .then((services) => {
        this.services = services;
      })
      .finally(() => {
        this.$scope.loaders.services = false;
      });
  }

  getExchangeAccountServices() {
    return this.OvhApiPackXdslExchangeAccount.Services()
      .v6()
      .query({
        packName: this.$stateParams.packName,
      })
      .$promise.then((serviceIds) =>
        serviceIds.map((serviceId) => {
          const regex = /^(.*)-(.*)$/gi;
          const [, exchangeService, accountId] = regex.exec(serviceId);
          return { exchangeService, accountId };
        }),
      );
  }

  getExchangeAccounts() {
    return this.getExchangeAccountServices()
      .then((exchangeServicesIds) => {
        const accountIdsByExchangeService = exchangeServicesIds.reduce(
          (all, { exchangeService, accountId }) => {
            return {
              ...all,
              [exchangeService]: [...(all[exchangeService] || []), accountId],
            };
          },
          {},
        );

        return this.$q.all(
          Object.keys(accountIdsByExchangeService).map((exchangeService) => {
            return this.iceberg(
              `/email/exchange/${exchangeService}/service/${exchangeService}/account`,
            )
              .query()
              .addFilter(
                'id',
                'in',
                accountIdsByExchangeService[exchangeService],
              )
              .expand('CachedObjectList-Pages')
              .execute()
              .$promise.then(({ data }) =>
                data.map((account) => ({
                  ...account,
                  managerUrl: this.coreURLBuilder.buildURL(
                    'web',
                    '#/exchange/:organization/:exchangeService/account',
                    {
                      organization: exchangeService,
                      exchangeService,
                    },
                  ),
                })),
              );
          }),
        );
      })
      .then((accounts) => accounts.flat());
  }
}
